/**
 * Table of Contents scroll spy — highlights active heading in the TOC sidebar.
 * Uses IntersectionObserver as primary driver with scroll listener fallback.
 * Animated expand/collapse of nested TOC levels.
 */
import { $$ } from './utils';

// Module-level state to allow cleanup on re-initialization (PJAX)
let observer: IntersectionObserver | null = null;
let onScroll: (() => void) | null = null;

function cleanup(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (onScroll) {
    window.removeEventListener('scroll', onScroll);
    onScroll = null;
  }
}

export function initToc(): void {
  cleanup();

  const tocSection = document.querySelector('.sidebar-card.sidebar-toc');
  if (!tocSection) return;

  const tocNav = tocSection.querySelector('nav.sidebar-toc');
  if (!tocNav) return;

  const tocLinks = tocNav.querySelectorAll('.toc-list-link');
  if (tocLinks.length === 0) return;

  const tocContainer = tocSection.querySelector('.sidebar-scroll');

  const headings = $$('.post-content h1[id], .post-content h2[id], .post-content h3[id]');
  if (headings.length === 0) return;

  // Build a lookup: heading id → TOC link (decode URI-encoded hrefs)
  const linkMap = new Map<string, Element>();
  tocLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      const id = decodeURIComponent(href.slice(1));
      linkMap.set(id, link);
    }
  });

  const THRESHOLD = 100; // px from viewport top — the "reading line"
  let updateTimer: ReturnType<typeof setTimeout> | null = null;
  const DEBOUNCE_MS = 90;
  let suppressObserver = false;

  // Find the heading closest to the reading line.
  function findActiveHeading(): Element | null {
    let lastAbove: Element | null = null;
    let lastAboveTop = -Infinity;
    let firstBelow: Element | null = null;
    let firstBelowTop = Infinity;

    headings.forEach((h) => {
      const top = h.getBoundingClientRect().top;
      if (top <= THRESHOLD) {
        if (top > lastAboveTop) {
          lastAboveTop = top;
          lastAbove = h;
        }
      } else {
        if (top < firstBelowTop) {
          firstBelowTop = top;
          firstBelow = h;
        }
      }
    });

    return lastAbove ?? firstBelow;
  }

  function updateChildHeights(): void {
    const allChildren = tocNav.querySelectorAll('.toc-list-child');
    allChildren.forEach((el) => {
      const child = el as HTMLElement;
      const parent = child.parentElement;
      if (!parent) return;

      const hasActive = parent.querySelector('.toc-list-link.active') !== null;

      child.style.height = '';
      const naturalH = child.scrollHeight;

      if (hasActive) {
        child.style.height = naturalH + 'px';
        child.classList.add('is-expanded');
      } else {
        child.style.height = child.clientHeight + 'px';
        requestAnimationFrame(() => {
          child.style.height = '0px';
          child.classList.remove('is-expanded');
        });
      }
    });
  }

  // Collect the current heading's link + all ancestor links
  function getActiveLinks(currentLink: Element): Set<Element> {
    const links = new Set<Element>([currentLink]);

    let li = currentLink.parentElement;
    while (li && li.classList.contains('toc-list-item')) {
      const parentOl = li.parentElement;
      if (!parentOl || !parentOl.classList.contains('toc-list-child')) break;
      const parentLi = parentOl.parentElement;
      if (!parentLi || !parentLi.classList.contains('toc-list-item')) break;
      const parentLink = parentLi.querySelector(':scope > .toc-list-link');
      if (parentLink) links.add(parentLink);
      li = parentLi;
    }

    return links;
  }

  function pickAndApplyActive(): void {
    const heading = findActiveHeading();
    if (!heading) return;

    const currentLink = linkMap.get(heading.id);
    if (!currentLink) return;

    const desired = getActiveLinks(currentLink);

    const currentActive = new Set<Element>();
    tocLinks.forEach((l) => {
      if (l.classList.contains('active')) currentActive.add(l);
    });

    if (desired.size === currentActive.size && [...desired].every((l) => currentActive.has(l)))
      return;

    tocLinks.forEach((l) => l.classList.remove('active'));
    desired.forEach((l) => l.classList.add('active'));

    updateChildHeights();
    scrollToActive(currentLink, tocContainer);
  }

  function scheduleUpdate(): void {
    if (suppressObserver) return;
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(pickAndApplyActive, DEBOUNCE_MS);
  }

  observer = new IntersectionObserver(() => scheduleUpdate(), {
    rootMargin: '-80px 0px -20% 0px',
  });

  headings.forEach((h) => observer!.observe(h));

  let scrollTicking = false;
  onScroll = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(() => {
        scheduleUpdate();
        scrollTicking = false;
      });
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  pickAndApplyActive();

  // Smooth scroll to heading on TOC link click
  let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
  const SCROLL_END_WAIT = 120;
  const SCROLL_MAX_WAIT = 3000;

  function onScrollStopped(): void {
    window.removeEventListener('scroll', handleClickScroll);
    suppressObserver = false;
    pickAndApplyActive();
  }

  function handleClickScroll(): void {
    if (scrollEndTimer) clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(onScrollStopped, SCROLL_END_WAIT);
  }

  tocLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;

      const id = decodeURIComponent(href.slice(1));
      const target = document.getElementById(id);
      if (!target) return;

      suppressObserver = true;

      const headerOffset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', '#' + target.id);

      window.addEventListener('scroll', handleClickScroll, { passive: true, once: false });
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => {
        window.removeEventListener('scroll', handleClickScroll);
        onScrollStopped();
      }, SCROLL_MAX_WAIT);
    });
  });
}

function scrollToActive(link: Element, container: Element | null): void {
  if (!container) return;

  const containerRect = container.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  const margin = 48;

  const isAbove = linkRect.top < containerRect.top + margin;
  const isBelow = linkRect.bottom > containerRect.bottom - margin;

  if (isAbove || isBelow) {
    link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

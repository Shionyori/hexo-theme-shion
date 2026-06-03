import { $$ } from './utils';

export function initToc(): void {
  const tocNav = document.querySelector('.sidebar-toc');
  if (!tocNav) return;

  const tocLinks = $$('.sidebar-toc .toc-list-link');
  if (tocLinks.length === 0) return;

  const tocContainer = tocNav.closest('.sidebar-scroll');
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
  // Prefers the last heading above the threshold (current section),
  // falls back to the first heading below (before any heading).
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
    const allChildren = document.querySelectorAll('.sidebar-toc .toc-list-child');
    allChildren.forEach((el) => {
      const child = el as HTMLElement;
      const parent = child.parentElement;
      if (!parent) return;

      const hasActive = parent.querySelector('.toc-list-link.active') !== null;

      // Temporarily lift height to measure natural content height
      child.style.height = '';
      const naturalH = child.scrollHeight;

      if (hasActive) {
        child.style.height = naturalH + 'px';
        child.classList.add('is-expanded');
      } else {
        // Re-apply current height (or 0) so transition starts from a known value
        child.style.height = child.clientHeight + 'px';
        // Force layout then set to 0 for collapse animation
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

    // Check if the active set actually changed
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

  // Primary driver: IntersectionObserver with a broad detection zone
  const observer = new IntersectionObserver(() => scheduleUpdate(), {
    rootMargin: '-80px 0px -20% 0px',
  });

  headings.forEach((h) => observer.observe(h));

  // Fallback: scroll listener catches edge cases (top/bottom of page)
  // where IntersectionObserver may not fire
  let scrollTicking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          scheduleUpdate();
          scrollTicking = false;
        });
      }
    },
    { passive: true },
  );

  // Smooth scroll to heading on TOC link click.
  // Uses scroll-end detection instead of a fixed timeout, so long-distance
  // jumps wait for the actual scroll animation to finish before updating.
  let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
  const SCROLL_END_WAIT = 120; // ms of no scroll → animation finished
  const SCROLL_MAX_WAIT = 3000; // safety cap

  function onScrollStopped(): void {
    window.removeEventListener('scroll', handleClickScroll);
    suppressObserver = false;
    pickAndApplyActive();
  }

  function handleClickScroll(): void {
    if (scrollEndTimer) clearTimeout(scrollEndTimer);
    // Renew the timer each time a scroll event fires;
    // only when events stop for SCROLL_END_WAIT ms do we consider it done.
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

      // Listen for scroll events until the smooth animation finishes
      window.addEventListener('scroll', handleClickScroll, { passive: true, once: false });
      // Safety: force unlock after SCROLL_MAX_WAIT even if scroll events keep firing
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

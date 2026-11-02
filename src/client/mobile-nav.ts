/**
 * Mobile navigation — slide-out navigation drawer with overlay and Escape-to-close.
 */
import { $, on } from './utils';

/**
 * Highlight the drawer entry that matches the current URL.
 *
 * The drawer lives outside the PJAX container, so its markup — including the
 * active state rendered by the template — is only correct for the page it was
 * first rendered with. Without this the menu keeps highlighting the old entry
 * after every in-site navigation.
 */
function syncActiveLink(): void {
  const normalize = (path: string): string => {
    const clean = path.replace(/index\.html$/, '');
    return clean.endsWith('/') ? clean : `${clean}/`;
  };
  const here = normalize(location.pathname);

  document.querySelectorAll<HTMLAnchorElement>('.mobile-nav-link').forEach((link) => {
    // Only same-origin entries can be "current".
    if (link.origin !== location.origin) return;

    const target = normalize(link.pathname);
    const active = target === '/' ? here === '/' : here.indexOf(target) === 0;
    link.classList.toggle('is-active', active);
    if (active) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

export function initMobileNav(): void {
  const toggle = $('#sidebar-toggle');
  const mobileNav = $('#mobile-nav');
  const mobileOverlay = $('#mobile-nav-overlay');
  const closeBtn = $('#mobile-nav-close');

  syncActiveLink();
  document.addEventListener('pjax:complete', syncActiveLink);

  if (!toggle || !mobileNav || !mobileOverlay) return;

  function open(): void {
    mobileNav.classList.add('is-open');
    mobileOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close(): void {
    mobileNav.classList.remove('is-open');
    mobileOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  on(toggle, 'click', open);

  if (closeBtn) {
    on(closeBtn, 'click', close);
  }

  on(mobileOverlay, 'click', close);

  // Auto-close when a nav link is clicked
  const navLinks = mobileNav.querySelectorAll('.mobile-nav-link');
  navLinks.forEach((link) => {
    on(link as HTMLElement, 'click', close);
  });

  on(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      close();
    }
  });
}

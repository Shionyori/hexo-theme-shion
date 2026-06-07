/**
 * Mobile navigation — slide-out navigation drawer with overlay and Escape-to-close.
 */
import { $, on } from './utils';

export function initMobileNav(): void {
  const toggle = $('#sidebar-toggle');
  const mobileNav = $('#mobile-nav');
  const mobileOverlay = $('#mobile-nav-overlay');
  const closeBtn = $('#mobile-nav-close');

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

  on(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      close();
    }
  });
}

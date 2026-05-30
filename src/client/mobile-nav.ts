import { $, on } from './utils';

export function initMobileNav(): void {
  const toggle = $('#sidebar-toggle');
  const nav = $('#mobile-nav');
  const overlay = $('#mobile-nav-overlay');
  const closeBtn = $('#mobile-nav-close');

  if (!toggle || !nav || !overlay) return;

  function open(): void {
    nav.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close(): void {
    nav.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  on(toggle, 'click', open);

  if (closeBtn) {
    on(closeBtn, 'click', close);
  }

  on(overlay, 'click', close);

  on(document, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
    }
  });
}

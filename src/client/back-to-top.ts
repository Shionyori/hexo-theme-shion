/**
 * Back-to-top button — floating button that appears after scrolling past 400px.
 */
import { on } from './utils';

export function initBackToTop(): void {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 15l-6-6-6 6"/>
    </svg>`;
  document.body.appendChild(btn);

  function toggleVisibility(): void {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }

  on(window, 'scroll', toggleVisibility, { passive: true });

  on(btn, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleVisibility();
}

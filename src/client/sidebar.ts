/**
 * Mobile sidebar toggle — floating button that opens the sidebar as a slide-out drawer.
 * Only shown on mobile (< 768px) after scrolling past a threshold.
 * Follows the same pattern as back-to-top.
 */
import { $, on } from './utils';

let btn: HTMLButtonElement | null = null;
let overlay: HTMLDivElement | null = null;

export function initSidebar(): void {
  // Guard: only create the chrome once (button + overlay live outside pjax-container)
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'sidebar-float-btn';
    btn.setAttribute('aria-label', 'Toggle sidebar');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>`;
    document.body.appendChild(btn);

    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  // Re-query the sidebar element every time (PJAX replaces it on navigation)
  function getSidebar(): HTMLElement | null {
    return $('#site-sidebar');
  }

  function open(): void {
    const sidebar = getSidebar();
    if (!sidebar) return;
    sidebar.classList.add('is-open');
    overlay!.classList.add('is-open');
    btn!.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function close(): void {
    const sidebar = getSidebar();
    if (sidebar) {
      sidebar.classList.remove('is-open');
    }
    overlay!.classList.remove('is-open');
    btn!.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  on(btn, 'click', () => {
    const sidebar = getSidebar();
    if (!sidebar) return;
    if (sidebar.classList.contains('is-open')) {
      close();
    } else {
      open();
    }
  });

  on(overlay, 'click', close);

  on(document, 'keydown', (e) => {
    const sidebar = getSidebar();
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('is-open')) {
      close();
    }
  });

  // Auto-close when a link inside the sidebar is clicked (PJAX navigation)
  on(document, 'click', (e) => {
    const target = e.target as HTMLElement;
    const sidebar = getSidebar();
    if (sidebar && sidebar.classList.contains('is-open') && target.closest('#site-sidebar a')) {
      close();
    }
  });
}

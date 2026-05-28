import { $, on } from './utils';

export function initSidebar(): void {
  const toggle = $('#sidebar-toggle');
  const sidebar = $('#site-sidebar');

  if (!toggle || !sidebar) return;

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function open(): void {
    sidebar!.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close(): void {
    sidebar!.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  on(toggle, 'click', () => {
    if (sidebar!.classList.contains('is-open')) {
      close();
    } else {
      open();
    }
  });

  on(overlay, 'click', close);

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && sidebar!.classList.contains('is-open')) {
      close();
    }
  });
}

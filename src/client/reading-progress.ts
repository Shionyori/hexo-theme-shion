import { on } from './utils';

export function initReadingProgress(): void {
  const bar = document.getElementById('reading-progress-bar');
  if (!bar) return;

  on(window, 'scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  }, { passive: true });
}

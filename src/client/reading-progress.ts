/**
 * Reading progress bar — thin bar at page top showing scroll progress as a percentage.
 */
import { on } from './utils';

export function initReadingProgress(): void {
  const bar = document.getElementById('reading-progress-bar');
  if (!bar) return;

  const update = (): void => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = Math.min(progress, 100) + '%';
  };

  // Sync without the width transition: a reload can restore a mid-page offset,
  // and animating the bar from 0% up to that value looks like it is shaking.
  const syncQuietly = (): void => {
    bar.style.transition = 'none';
    update();
    void bar.offsetHeight; // flush the width so later updates animate from it
    bar.style.transition = '';
  };

  on(window, 'scroll', update, { passive: true });

  // Restored scroll offsets can land before or after `load`, so sync on both.
  syncQuietly();
  window.addEventListener('load', syncQuietly, { once: true });
}

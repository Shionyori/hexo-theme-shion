/**
 * Smart header hide/show — hides on scroll down, shows on scroll up with hysteresis.
 */
import { $ } from './utils';

const HIDE_THRESHOLD = 80; // px scrolled before header can hide
const SHOW_THRESHOLD = 30; // px scrolled up before header shows
const HIDDEN_CLASS = 'header-hidden';

let lastScrollY = 0;
let accumulatedDelta = 0;

function onScroll(): void {
  const header = $('.site-header');
  if (!header) return;

  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;
  lastScrollY = currentY;

  // At the very top, always show
  if (currentY <= 0) {
    header.classList.remove(HIDDEN_CLASS);
    accumulatedDelta = 0;
    return;
  }

  // Scrolling down
  if (delta > 0) {
    accumulatedDelta = Math.min(accumulatedDelta + delta, HIDE_THRESHOLD * 2);
    if (accumulatedDelta > HIDE_THRESHOLD) {
      header.classList.add(HIDDEN_CLASS);
    }
  }
  // Scrolling up
  else if (delta < 0) {
    accumulatedDelta = Math.max(accumulatedDelta + delta, -SHOW_THRESHOLD * 2);
    if (accumulatedDelta < -SHOW_THRESHOLD) {
      header.classList.remove(HIDDEN_CLASS);
    }
  }
}

export function initHeaderScroll(): void {
  window.addEventListener('scroll', onScroll, { passive: true });
}

/**
 * Client-side entry point — initializes browser modules.
 * Chrome inits run once. Content inits run on DOMContentLoaded + after each PJAX swap.
 */
import { initTheme } from './theme';
import { initSearch } from './search';
import { initSidebar } from './sidebar';
import { initToc } from './toc';
import { initBackToTop } from './back-to-top';
import { initReadingProgress } from './reading-progress';
import { initShare } from './share';
import { initMobileNav } from './mobile-nav';
import { initLightbox } from './lightbox';
import { initTabs as initTagTabs } from './tabs';
import { initAnimations } from './animations';
import { initHeaderScroll } from './header-scroll';
import { initCardClick } from './card-click';
import { initHeadingAnchors } from './heading-anchors';
import { initCodeCopy } from './code-copy';
import { initImageError } from './image-error';
import { initImageReveal } from './image-reveal';
import { initMusicPlayer } from './music-player';
import { initPjax } from './pjax';
import { initMath } from './math';
import { initComments } from './comments';
import { initStats } from './stats';
import { initUptime } from './uptime';

// ── Chrome: run once ────────────────────────────────────────

/**
 * Enable CSS smooth scrolling only once the user has interacted.
 *
 * `html { scroll-behavior: smooth }` is intentionally not applied at parse time:
 * it also animates scroll corrections the browser makes on its own (scroll
 * restoration on reload, `window.scrollTo` in PJAX), which made the page slide
 * a few dozen pixels and look like it was shaking on refresh. Any anchor jump
 * the user can trigger is preceded by a gesture, so nothing is lost.
 */
function initSmoothScroll(): void {
  const enable = (): void => document.documentElement.classList.add('smooth-scroll');
  window.addEventListener('pointerdown', enable, { once: true, capture: true, passive: true });
  window.addEventListener('keydown', enable, { once: true, capture: true });
}

function initChrome(): void {
  initTheme();
  initSearch();
  initSidebar();
  initBackToTop();
  initReadingProgress();
  initMobileNav();
  initHeaderScroll();
  initSmoothScroll();
  initPjax(); // must be last — wires up link interception
}

// ── Content: run on every navigation ────────────────────────

function initContent(): void {
  initMusicPlayer();
  // initMath must run BEFORE initToc because it modifies .post-content innerHTML,
  // which would detach heading elements that initToc has already captured.
  initMath();
  initToc();
  initLightbox();
  initImageError();
  initImageReveal();
  initTagTabs();
  initAnimations();
  initCardClick();
  initHeadingAnchors();
  initCodeCopy();
  initShare();
  initComments();
  initUptime();
  // Stats go last: it re-runs the busuanzi script after a PJAX swap, which must
  // happen once the new #pjax-container (with its page-view node) is in place.
  initStats();
}

// ── Bootstrap ───────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initChrome();
  initContent();
});

document.addEventListener('pjax:complete', () => {
  initContent();
});

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
import { initMusicPlayer } from './music-player';
import { initPjax } from './pjax';
import { initMath } from './math';

// ── Chrome: run once ────────────────────────────────────────

function initChrome(): void {
  initTheme();
  initSearch();
  initSidebar();
  initBackToTop();
  initReadingProgress();
  initMobileNav();
  initHeaderScroll();
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
  initTagTabs();
  initAnimations();
  initCardClick();
  initHeadingAnchors();
  initCodeCopy();
  initShare();
}

// ── Bootstrap ───────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initChrome();
  initContent();
});

document.addEventListener('pjax:complete', () => {
  initContent();
});

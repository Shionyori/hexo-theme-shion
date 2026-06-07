/**
 * Client-side entry point — initializes all browser modules on DOMContentLoaded.
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

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSearch();
  initSidebar();
  initToc();
  initBackToTop();
  initReadingProgress();
  initShare();
  initMobileNav();
  initLightbox();
  initImageError();
  initTagTabs();
  initAnimations();
  initHeaderScroll();
  initCardClick();
  initHeadingAnchors();
  initCodeCopy();
});

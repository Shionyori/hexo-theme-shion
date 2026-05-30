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
  initTagTabs();
});

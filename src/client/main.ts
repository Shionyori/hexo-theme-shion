import { initTheme } from './theme';
import { initSearch } from './search';
import { initSidebar } from './sidebar';
import { initToc } from './toc';
import { initBackToTop } from './back-to-top';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSearch();
  initSidebar();
  initToc();
  initBackToTop();
});

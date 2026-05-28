import { $$ } from './utils';

export function initToc(): void {
  const tocLinks = $$('.post-toc .toc-link, .sidebar-toc .toc-link');
  if (tocLinks.length === 0) return;

  const headings = $$('.post-content h1[id], .post-content h2[id], .post-content h3[id]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = document.querySelector(
          `.post-toc a[href="#${CSS.escape(id)}"], .sidebar-toc a[href="#${CSS.escape(id)}"]`
        );
        if (link) {
          link.classList.toggle('active', entry.isIntersecting);
        }
      });
    },
    { rootMargin: '-80px 0px -60% 0px' }
  );

  headings.forEach((h) => observer.observe(h));
}

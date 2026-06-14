/**
 * Entrance animations — staggered fade-in for above-fold elements.
 * IntersectionObserver triggers below-fold elements on scroll.
 * All animation selectors are configured here to keep them in one place.
 */
export function initAnimations(): void {
  // IntersectionObserver for below-fold elements — triggers fade-in
  // when the element scrolls into view.
  // No rAF needed here: these elements have been painted in their
  // hidden state for many frames, so the transition will fire immediately.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target as HTMLElement;
        const delay = Number(target.dataset.animDelay) || 0;
        observer.unobserve(target);

        target.style.transitionDelay = delay + 'ms';
        target.classList.add('is-visible');
        target.addEventListener('transitionend', () => (target.style.transitionDelay = ''), {
          once: true,
        });
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 100px 0px' },
  );

  // Trigger entrance animation for all elements matching `selector`.
  function animate(selector: string, stagger = 60): void {
    const els = document.querySelectorAll<HTMLElement>(selector);
    if (els.length === 0) return;

    els.forEach((el, i) => {
      el.dataset.animDelay = String(i * stagger);

      const cleanup = () => (el.style.transitionDelay = '');

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Above fold: double rAF ensures the hidden state is painted
        // before is-visible triggers the CSS transition.
        el.offsetHeight;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            el.style.transitionDelay = String(i * stagger) + 'ms';
            el.classList.add('is-visible');
            // Clean up inline transitionDelay after entrance ends,
            // otherwise it leaks into hover/other transitions.
            el.addEventListener('transitionend', cleanup, { once: true });
          });
        });
      } else {
        // Below fold: observe and trigger on scroll.
        observer.observe(el);
      }
    });
  }

  // ── Home page: post cards cascade in ─────────────────────
  animate('.post-card-wrapper', 60);

  // ── Sidebar (all variants: profile, widgets, TOC-only on post pages) ──
  animate('.sidebar-inner', 0);

  // Widgets inside the sidebar widget card (staggered cascade)
  animate('.widget', 60);

  // ── Content cards (archive, tag page, category page, about page) ──
  animate('.content-card', 0);

  // ── Post & Page ──────────────────────────────────────────
  animate('.post', 0);
  animate('.page', 0);

  // Post page sections — staggered cascade after the card fades in
  animate('.post-header, .page-title', 0);
  animate('.post-content', 30);
  animate('.post-tags-footer', 60);
  animate('.post-share', 80);
  animate('.post-copyright', 100);
  animate('.post-nav', 120);

  // ── Pagination ───────────────────────────────────────────
  animate('.pagination', 0);

  // ── List items (archive, categories, tag cloud) ──────────
  animate('.archive-item', 40);

  // ── Comments, 404 ────────────────────────────────────────
  animate('.comments', 0);
  animate('.not-found-content', 0);
}

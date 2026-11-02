/**
 * Entrance animations — staggered fade-in for above-fold elements.
 * IntersectionObserver triggers below-fold elements on scroll.
 * All animation selectors are configured here to keep them in one place.
 */

// Below-fold elements waiting for their reveal. Kept at module scope so the
// "jumped past it" guard below can be bound only once, even though
// `initAnimations` re-runs on every PJAX navigation.
const pending = new Set<HTMLElement>();
let guardBound = false;

// Above-fold reveals still running. Scroll anchoring stays disabled
// (`html.entrance-phase`) until they have all finished, so the browser cannot
// chase the entrance offset.
let settling = 0;

function entranceSettled(): void {
  if (settling > 0) return;
  document.documentElement.classList.remove('entrance-phase');
}

export function initAnimations(): void {
  pending.forEach((el) => {
    if (!el.isConnected) pending.delete(el);
  });

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
        pending.delete(target);

        target.style.transitionDelay = delay + 'ms';
        target.classList.add('is-visible');
        target.addEventListener('transitionend', () => (target.style.transitionDelay = ''), {
          once: true,
        });
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 100px 0px' },
  );

  // Jump scrolling (End key, dragging the scrollbar, an anchor jump) can skip
  // over observed elements without ever reporting an intersection, which would
  // leave them invisible for good. Reveal anything that ended up above the
  // viewport — instantly, since it is off-screen anyway.
  if (!guardBound) {
    guardBound = true;
    window.addEventListener(
      'scroll',
      () => {
        if (pending.size === 0) return;
        pending.forEach((el) => {
          if (!el.isConnected) {
            pending.delete(el);
            return;
          }
          if (el.getBoundingClientRect().bottom >= 0) return;
          pending.delete(el);
          el.style.transitionDelay = '';
          el.classList.add('is-visible');
        });
      },
      { passive: true },
    );
  }

  // Trigger entrance animation for all elements matching `selector`.
  function animate(selector: string, stagger = 60): void {
    const els = document.querySelectorAll<HTMLElement>(selector);
    if (els.length === 0) return;

    els.forEach((el, i) => {
      el.dataset.animDelay = String(i * stagger);

      const cleanup = () => {
        el.style.transitionDelay = '';
        settling -= 1;
        entranceSettled();
      };

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        // Above fold: double rAF ensures the hidden state is painted
        // before is-visible triggers the CSS transition.
        el.offsetHeight;
        settling += 1;
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
        pending.add(el);
        observer.observe(el);
      }
    });
  }

  // ── Home page: post cards cascade in, paginator last ─────
  // The paginator is matched after the cards in DOM order, so it inherits the
  // next staggered delay and always trails the last article card.
  animate('.post-card-wrapper, .pagination', 60);

  // ── Sidebar (all variants: profile, widgets, TOC-only on post pages) ──
  animate('.sidebar-card', 0);

  // Widgets inside the sidebar widget card (staggered cascade)
  animate('.widget', 60);

  // ── Content cards (archive, tag page, category page, about page) ──
  animate('.content-card', 0);

  // ── Page hero copy (title → subtitle → tags) ─────────────
  animate('.hero-title, .hero-subtitle, .hero-tags', 90);

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

  // ── List items (archive, categories, tag cloud) ──────────
  animate('.archive-item', 40);

  // ── Friends page cards (staggered cascade) ─────────────
  animate('.friend-card-wrapper', 80);

  // ── Comments, 404 ────────────────────────────────────────
  animate('.comments', 0);
  animate('.not-found-content', 0);

  // Nothing above the fold (or every reveal already scheduled) → hand scroll
  // anchoring back right away. `transitionend` normally clears the phase; the
  // timer is a safety net for reveals that never transition (reduced motion,
  // throttled background tab, ...).
  entranceSettled();
  window.setTimeout(entranceSettled, 2000);
}

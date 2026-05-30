export function initAnimations(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target as HTMLElement;

        // Stagger delay for cards in a list
        const delay = target.dataset.animDelay;
        if (delay) {
          target.style.transitionDelay = delay + 'ms';
        }

        target.classList.add('is-visible');
        observer.unobserve(target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  // Observe post cards with stagger
  document.querySelectorAll('.post-card').forEach((el, i) => {
    const card = el as HTMLElement;
    card.classList.add('anim-fade-in-up');
    card.dataset.animDelay = String(i * 80);

    // Above-fold cards appear immediately
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      card.classList.add('is-visible');
      card.style.transitionDelay = String(i * 80) + 'ms';
    } else {
      observer.observe(el);
    }
  });

  // Observe widgets with stagger
  document.querySelectorAll('.widget').forEach((el, i) => {
    (el as HTMLElement).classList.add('anim-fade-in-up');
    (el as HTMLElement).dataset.animDelay = String(i * 60);
    observer.observe(el);
  });

  // Observe archive items
  document.querySelectorAll('.archive-item, .category-item').forEach((el, i) => {
    (el as HTMLElement).classList.add('anim-fade-in-up');
    (el as HTMLElement).dataset.animDelay = String(i * 60);
    observer.observe(el);
  });

  // Observe tag cloud items
  document.querySelectorAll('.tag-cloud-item').forEach((el, i) => {
    (el as HTMLElement).classList.add('anim-fade-in');
    (el as HTMLElement).dataset.animDelay = String(i * 40);
    observer.observe(el);
  });

  // Observe page content (post, page, 404)
  document.querySelectorAll('.post-header, .page-title, .not-found').forEach((el) => {
    (el as HTMLElement).classList.add('anim-fade-in-up');
    observer.observe(el);
  });

  // Observe post content
  document.querySelectorAll('.post-content, .page').forEach((el) => {
    (el as HTMLElement).classList.add('anim-fade-in-up');
    observer.observe(el);
  });
}

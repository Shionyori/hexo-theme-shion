/**
 * Progressive image reveal — gives content images that have not finished loading a soft
 * focus-pull entrance. Images that are already decoded are left untouched so nothing
 * flashes on first paint (and only paint changes, so layout shift stays at zero).
 */
const REVEAL_SELECTOR = '.post-content img, .page-content img, .post-card-cover img';

export function initImageReveal(): void {
  const images = document.querySelectorAll<HTMLImageElement>(REVEAL_SELECTOR);

  images.forEach((img) => {
    if (img.dataset.reveal === 'true') return;
    img.dataset.reveal = 'true';

    // Already decoded (cached / eager) — show as-is, no entrance.
    if (img.complete && img.naturalWidth > 0) return;

    img.classList.add('img-reveal');

    const cleanup = (): void => img.classList.remove('img-reveal', 'is-loaded');
    const reveal = (): void => {
      img.classList.add('is-loaded');
      // Drop the reveal classes afterwards so the element returns to its
      // component's own (typically snappier) hover transition.
      img.addEventListener('transitionend', cleanup, { once: true });
      setTimeout(cleanup, 1000);
    };

    img.addEventListener('load', reveal, { once: true });
    img.addEventListener('error', reveal, { once: true });
  });
}

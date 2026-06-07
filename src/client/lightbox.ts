/**
 * Image lightbox — medium-zoom integration for post/page content images.
 */
declare global {
  interface Window {
    mediumZoom?: (selector: string | Element, options?: Record<string, unknown>) => void;
  }
}

export function initLightbox(): void {
  const images = document.querySelectorAll('.post-content img, .page-content img');
  if (images.length === 0) return;

  const mz = window.mediumZoom;
  if (typeof mz === 'function') {
    mz('.post-content img:not(.no-zoom), .page-content img:not(.no-zoom)', {
      margin: 40,
      background: 'rgba(0, 0, 0, 0.88)',
      scrollOffset: 0,
    });
  }
}

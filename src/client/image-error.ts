/**
 * Handle broken images in post/page content.
 * Replaces failed images with a 404 fallback and adds .img-error class.
 */
export function initImageError(): void {
  const fallback = '/images/shion/404.png';

  document.addEventListener(
    'error',
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.tagName !== 'IMG') return;

      const img = target as HTMLImageElement;
      // Only handle images in post/page content
      if (!img.closest('.post-content, .page-content')) return;
      // Avoid infinite loop if fallback itself fails
      if (img.src.endsWith(fallback)) return;

      img.src = fallback;
      img.classList.add('img-error');
      // Remove zoom cursor since broken image shouldn't be zoomed
      img.classList.add('no-zoom');
    },
    true,
  );
}

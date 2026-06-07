/**
 * Broken image handler — replaces failed post/page images with a Shion 404 fallback.
 * Uses event delegation on document to catch dynamically loaded images.
 * Adds .img-error and .no-zoom classes to prevent zoom cursor on fallback.
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

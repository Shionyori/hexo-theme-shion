export function initLightbox(): void {
  const images = document.querySelectorAll('.post-content a[data-fancybox]');
  if (images.length === 0) return;

  // Dynamically import Fancybox
  import('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5/dist/fancybox/fancybox.esm.js')
    .then(({ Fancybox }) => {
      Fancybox.bind('[data-fancybox]', {
        Thumbs: { autoStart: false },
        Toolbar: {
          display: ['zoom', 'slideShow', 'fullScreen', 'thumbs', 'close'],
        },
      });
    })
    .catch(() => {
      // Fancybox failed to load, images will be plain links
    });
}

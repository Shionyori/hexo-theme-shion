import Hexo from 'hexo';

export function registerGalleryTag(hexo: Hexo): void {
  hexo.extend.tag.register(
    'gallery',
    function (_args: string[], content: string) {
      const images = content.trim().split('\n').filter(Boolean);
      if (images.length === 0) return '';

      let html = '<div class="tag-gallery">';
      images.forEach((img: string) => {
        const trimmed = img.trim();
        const srcMatch = trimmed.match(/!\[.*?\]\((.+?)\)/);
        const src = srcMatch ? srcMatch[1] : trimmed;
        html += `<div class="gallery-item"><img src="${src}" loading="lazy"></div>`;
      });
      html += '</div>';

      return html;
    },
    { ends: true },
  );
}

import Hexo from 'hexo';

export function registerImageTag(hexo: Hexo): void {
  hexo.extend.tag.register('image', function (args: string[]) {
    const src = args[0] || '';
    const alt = args[1] || '';
    const caption = args[2] || '';

    let html = `<figure class="image-figure">`;
    html += `<img src="${src}" alt="${alt}" loading="lazy">`;
    if (caption) {
      html += `<figcaption>${caption}</figcaption>`;
    }
    html += `</figure>`;
    return html;
  });
}

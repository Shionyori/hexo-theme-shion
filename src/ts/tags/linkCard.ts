/**
 * External link card tag plugin — renders a styled link preview card for any URL.
 */
import Hexo from 'hexo';

export function registerLinkCardTag(hexo: Hexo): void {
  hexo.extend.tag.register('linkCard', function (args: string[], _content: string) {
    const title = args[0] || 'Link';
    const url = args[1] || '#';
    const desc = args[2] || '';

    return `
    <a class="tag-link-card" href="${url}" target="_blank" rel="noopener">
      <span class="link-card-title">${title}</span>
      ${desc ? `<span class="link-card-desc">${desc}</span>` : ''}
      <span class="link-card-url">${url}</span>
    </a>`;
  });
}

/**
 * External link card tag plugin — renders a styled link preview card for any URL.
 */
import Hexo from 'hexo';
import { iconForUrl } from './linkCardIcons';

export function registerLinkCardTag(hexo: Hexo): void {
  hexo.extend.tag.register('linkCard', function (args: string[], _content: string) {
    const title = args[0] || 'Link';
    const url = args[1] || '#';
    const desc = args[2] || '';

    // Well-known hosts get their brand mark, everything else the external arrow.
    return `
    <a class="tag-link-card" href="${url}" target="_blank" rel="noopener">
      <span class="link-card-icon" aria-hidden="true">${iconForUrl(url)}</span>
      <span class="link-card-body">
        <span class="link-card-title">${title}</span>
        ${desc ? `<span class="link-card-desc">${desc}</span>` : ''}
        <span class="link-card-url">${url}</span>
      </span>
    </a>`;
  });
}

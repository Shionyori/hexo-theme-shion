/**
 * Styled blockquote tag plugin — renders a styled <blockquote> with optional author and source.
 */
import Hexo from 'hexo';

export function registerQuoteTag(hexo: Hexo): void {
  hexo.extend.tag.register(
    'blockquote',
    function (this: { author?: string; source?: string }, args: string[], content: string) {
      const author = args[0] || '';
      const source = args[1] || '';

      let html = `<blockquote class="styled-blockquote">`;
      html += content;
      if (author) {
        html += `<footer class="blockquote-footer">&mdash; ${author}`;
        if (source) {
          html += `, <cite>${source}</cite>`;
        }
        html += `</footer>`;
      }
      html += `</blockquote>`;
      return html;
    },
    { ends: true },
  );
}

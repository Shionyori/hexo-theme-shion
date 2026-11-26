/**
 * Details/summary tag plugin — renders a collapsible <details> block.
 */
import Hexo from 'hexo';

export function registerDetailsTag(hexo: Hexo): void {
  hexo.extend.tag.register(
    'details',
    function (args: string[], content: string) {
      const summary = args[0] || 'Details';
      const rendered = hexo.render.renderSync({ text: content, engine: 'markdown' });
      // Two wrappers for initDetails(): the body's height is the open/close
      // animation (and the clip), the inner only carries the translateY so the
      // text slides into place instead of being wiped in from below.
      return `<details class="tag-details"><summary>${summary}</summary><div class="tag-details-body"><div class="tag-details-inner">${rendered}</div></div></details>`;
    },
    { ends: true },
  );
}

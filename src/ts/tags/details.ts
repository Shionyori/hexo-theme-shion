/**
 * Details/summary tag plugin — renders a collapsible <details> block.
 */
import Hexo from 'hexo';

export function registerDetailsTag(hexo: Hexo): void {
  hexo.extend.tag.register(
    'details',
    function (args: string[], content: string) {
      const summary = args[0] || 'Details';
      return `<details class="tag-details"><summary>${summary}</summary>${content}</details>`;
    },
    { ends: true },
  );
}

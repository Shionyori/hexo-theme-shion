/**
 * Tabs tag plugin — renders a tabbed interface with headers and content panels.
 */
import Hexo from 'hexo';

export function registerTabsTag(hexo: Hexo): void {
  hexo.extend.tag.register(
    'tabs',
    function (args: string[], content: string) {
      const activeIndex = parseInt(args[0], 10) || 0;
      const blocks = content.split(/<!--\s*tab\s*-->/).filter(Boolean);

      if (blocks.length === 0) return '';

      let html = '<div class="tabs">';

      // Tab headers
      html += '<div class="tabs-header">';
      blocks.forEach((block: string, i: number) => {
        const match = block.match(/^<!--\s*"([^"]+)"\s*-->/);
        const label = match ? match[1] : 'Tab ' + (i + 1);
        html += `<button class="tab-btn${i === activeIndex ? ' active' : ''}" data-tab="${i}">${label}</button>`;
      });
      html += '</div>';

      // Tab content
      html += '<div class="tabs-content">';
      blocks.forEach((block: string, i: number) => {
        const cleaned = block.replace(/^<!--\s*"[^"]+"\s*-->/, '').trim();
        html += `<div class="tab-panel${i === activeIndex ? ' active' : ''}" data-tab="${i}">${cleaned}</div>`;
      });
      html += '</div></div>';

      return html;
    },
    { ends: true },
  );
}

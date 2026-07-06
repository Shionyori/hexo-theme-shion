/**
 * Note/callout tag plugin — renders color-coded info/warning/success/danger blocks.
 */
import Hexo from 'hexo';

export function registerNoteTag(hexo: Hexo): void {
  hexo.extend.tag.register(
    'note',
    function (this: { type?: string }, args: string[], content: string) {
      const type = args[0] || 'info';
      const validTypes = ['info', 'warning', 'success', 'danger'];
      const noteType = validTypes.includes(type) ? type : 'info';

      // Render inner markdown content
      const rendered = hexo.render.renderSync({ text: content, engine: 'markdown' });
      return `<div class="note note-${noteType}">${rendered}</div>`;
    },
    { ends: true },
  );
}

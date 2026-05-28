import Hexo from 'hexo';

export function registerNoteTag(hexo: Hexo): void {
  hexo.extend.tag.register('note', function (
    this: { type?: string },
    args: string[],
    content: string
  ) {
    const type = args[0] || 'info';
    const validTypes = ['info', 'warning', 'success', 'danger'];
    const noteType = validTypes.includes(type) ? type : 'info';

    return `<div class="note note-${noteType}">${content}</div>`;
  }, { ends: true });
}

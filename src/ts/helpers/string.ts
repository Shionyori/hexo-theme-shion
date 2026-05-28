import Hexo from 'hexo';

export function registerStringHelpers(hexo: Hexo): void {
  hexo.extend.helper.register('excerpt', function (content: string, length?: number) {
    const maxLen = length || (this as any).theme.home?.excerpt_length || 200;
    const text = content.replace(/<[^>]*>/g, '').trim();
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '...';
  });

  hexo.extend.helper.register('word_count', function (content: string) {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const cn = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
    const en = (text.match(/[a-zA-Z0-9]+/g) || []).length;
    const total = cn + en;
    return total + ' ' + (total === 1 ? 'word' : 'words');
  });

  hexo.extend.helper.register('reading_time', function (content: string) {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const cn = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
    const en = (text.match(/[a-zA-Z0-9]+/g) || []).length;
    const minutes = Math.max(1, Math.ceil(cn / 300 + en / 200));
    return minutes + ' min read';
  });

  hexo.extend.helper.register('strip_html', function (html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  });
}

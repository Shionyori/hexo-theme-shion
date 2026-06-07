/**
 * Date formatting helpers.
 */
import Hexo from 'hexo';

export function registerDateHelpers(hexo: Hexo): void {
  hexo.extend.helper.register('format_date', function (date: Date | string, format?: string) {
    const moment = hexo.extend.helper.get('date') as (d: Date | string, f?: string) => string;
    const fmt = format || (this as any).theme.post?.date_format || 'YYYY-MM-DD';
    return moment(date, fmt);
  });
}

/**
 * Utility helpers — current page detection, Shion image path resolution.
 */
import Hexo from 'hexo';

export function registerUtilHelpers(hexo: Hexo): void {
  hexo.extend.helper.register('is_current', function (path: string, currentPath?: string) {
    const current = currentPath || this.page?.path || '';
    if (path === '/') return current === 'index.html' || current === '';
    return current.startsWith(path.replace(/\/$/, ''));
  });

  hexo.extend.helper.register('shion_image', function (name: string) {
    const config = (this as any).theme.shion || {};
    return config[name + '_image'] || '/images/shion/' + name + '.png';
  });
}

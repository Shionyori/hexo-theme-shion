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

  // Site uptime — returns the rendered text plus everything the client needs to
  // keep it ticking (ISO start, %s-slot format, refresh interval). The set of
  // units follows `runtime.precision`: day | hour | minute | second.
  hexo.extend.helper.register('site_uptime', function () {
    const config = (this as any).theme?.runtime;
    if (!config || config.enable === false || !config.since) return null;

    const since = new Date(config.since);
    if (Number.isNaN(since.getTime())) return null;

    const __ = (this as any).__ || ((key: string) => key);
    const order = ['day', 'hour', 'minute', 'second'];
    const precision = order.indexOf(config.precision) !== -1 ? config.precision : 'second';
    const units = order.slice(0, order.indexOf(precision) + 1);

    const seconds = Math.max(0, Math.floor((Date.now() - since.getTime()) / 1000));
    const values: Record<string, number> = {
      day: Math.floor(seconds / 86400),
      hour: Math.floor(seconds / 3600) % 24,
      minute: Math.floor(seconds / 60) % 60,
      second: seconds % 60,
    };

    // Build "%s 天 %s 小时 …" from the localized unit names so every language can
    // own its own unit order/spacing without a key per precision combination.
    const format = units.map((unit) => '%s ' + __('uptime_' + unit)).join(' ');

    let index = 0;
    const text = format.replace(/%s/g, () => String(values[units[index++]]));

    const refresh = Number(config.refresh);
    return {
      iso: since.toISOString(),
      format,
      text,
      refresh: Number.isFinite(refresh) && refresh > 0 ? refresh : 0,
      label: config.label !== false,
      icon: config.icon !== false,
    };
  });
}

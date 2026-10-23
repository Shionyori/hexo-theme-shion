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

  // Sidebar widget names that actually resolve to a partial. Unknown names are
  // dropped (with one warning per name) so a typo in `sidebar.widgets` cannot
  // break the build or silently leave an empty card behind.
  const warnedWidgets = new Set<string>();

  function availableWidgets(): Set<string> {
    const views: Record<string, unknown> = (hexo as any).theme?.views || {};
    const names = new Set<string>();
    for (const key of Object.keys(views)) {
      // Theme views are keyed without the `layout/` prefix and without the
      // extension: `_partial/widgets/recent-posts`.
      const match = key
        .replace(/\\/g, '/')
        .match(/^(?:layout\/)?_partial\/widgets\/(.+?)(?:\.ejs)?$/);
      if (match) names.add(match[1]);
    }
    return names;
  }

  hexo.extend.helper.register('sidebar_widgets', function (widgets: unknown) {
    const list = Array.isArray(widgets) ? widgets.map(String) : [];
    if (list.length === 0) return [];

    const available = availableWidgets();
    const valid: string[] = [];
    for (const name of list) {
      if (available.has(name)) {
        valid.push(name);
      } else if (!warnedWidgets.has(name)) {
        warnedWidgets.add(name);
        hexo.log.warn(
          '[shion] sidebar: unknown widget `%s` ignored. Available: %s',
          name,
          [...available].join(', '),
        );
      }
    }
    return valid;
  });

  // Nav icons — one 24x24 stroke glyph per menu entry, matched by the menu key
  // (English or Chinese). Unknown keys fall back to a link glyph so every item
  // keeps the same optical rhythm instead of some entries losing their icon.
  const NAV_GLYPHS: Record<string, string> = {
    home: '<path d="M3.6 10.3 12 3.6l8.4 6.7V20a1 1 0 0 1-1 1h-4.7v-6.2H9.3V21H4.6a1 1 0 0 1-1-1z"/>',
    archive:
      '<rect x="3" y="4" width="18" height="4.2" rx="1"/><path d="M5.2 8.2V20a1 1 0 0 0 1 1h11.6a1 1 0 0 0 1-1V8.2"/><path d="M9.8 12.4h4.4"/>',
    tag: '<path d="M20.6 13.2 13.2 20.6a1.8 1.8 0 0 1-2.5 0l-7.3-7.3a1.8 1.8 0 0 1-.5-1.3V5a1.8 1.8 0 0 1 1.8-1.8h7a1.8 1.8 0 0 1 1.3.5l7.6 7.6a1.8 1.8 0 0 1 0 2.5z"/><circle cx="7.6" cy="7.6" r="1.1"/>',
    folder:
      '<path d="M3.4 7.4a1.8 1.8 0 0 1 1.8-1.8h3.9l1.8 2h7.9a1.8 1.8 0 0 1 1.8 1.8v8.6a1.8 1.8 0 0 1-1.8 1.8H5.2a1.8 1.8 0 0 1-1.8-1.8z"/>',
    users:
      '<circle cx="9.2" cy="8.2" r="3.2"/><path d="M2.8 20a6.4 6.4 0 0 1 12.8 0"/><path d="M16.4 5.4a3.2 3.2 0 0 1 0 5.6"/><path d="M17.8 14.4a6.4 6.4 0 0 1 3.4 5.6"/>',
    info: '<circle cx="12" cy="12" r="8.6"/><path d="M12 11.2v5.2"/><path d="M12 7.9h.01"/>',
    link: '<path d="M10.2 13.8a4.6 4.6 0 0 0 6.5 0l2.6-2.6a4.6 4.6 0 0 0-6.5-6.5l-1 1"/><path d="M13.8 10.2a4.6 4.6 0 0 0-6.5 0l-2.6 2.6a4.6 4.6 0 0 0 6.5 6.5l1-1"/>',
  };

  const NAV_ICONS: Record<string, string> = {
    home: 'home',
    index: 'home',
    首页: 'home',
    主页: 'home',
    archives: 'archive',
    archive: 'archive',
    归档: 'archive',
    歸檔: 'archive',
    tags: 'tag',
    tag: 'tag',
    标签: 'tag',
    標籤: 'tag',
    categories: 'folder',
    category: 'folder',
    分类: 'folder',
    分類: 'folder',
    friends: 'users',
    friend: 'users',
    links: 'users',
    友链: 'users',
    友鏈: 'users',
    about: 'info',
    关于: 'info',
    關於: 'info',
  };

  // Measured ink centres (getBBox) of the glyphs above: several sit 0.15-0.7
  // units below the 24-unit box centre, which reads as "the icon sits low" next
  // to CJK labels. Compensate so every glyph is optically centred.
  const NAV_GLYPH_DY: Record<string, number> = {
    home: 0.3,
    archive: 0.5,
    tag: 0.15,
    folder: 0.7,
    users: 0.5,
    info: 0,
    link: 0,
  };

  hexo.extend.helper.register('menu_icon', function (name: string) {
    const key = String(name || '')
      .trim()
      .toLowerCase();
    const glyphKey = NAV_ICONS[key] || 'link';
    const shift = -(NAV_GLYPH_DY[glyphKey] || 0);
    return (
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<g transform="translate(0 ' +
      shift.toFixed(2) +
      ')">' +
      NAV_GLYPHS[glyphKey] +
      '</g></svg>'
    );
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

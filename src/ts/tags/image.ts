/**
 * Image tag plugin — renders <figure> with named or positional arguments.
 * Supports: src, alt, caption, size, align, nozoom, inline, class.
 */
import Hexo from 'hexo';

export function registerImageTag(hexo: Hexo): void {
  hexo.extend.tag.register('image', function (args: string[]) {
    let src = '';
    let alt = '';
    let caption = '';
    let width = '';
    let height = '';
    let extraClass = '';

    const hasNamed = args.some((a) => a.includes('='));

    if (hasNamed) {
      // Named mode: {% image src=... alt=... caption=... size=... align=... nozoom=... inline=... %}
      const named: Record<string, string> = {};
      const rest: string[] = [];
      for (const arg of args) {
        const eq = arg.indexOf('=');
        if (eq > 0) {
          named[arg.slice(0, eq)] = arg.slice(eq + 1);
        } else {
          rest.push(arg);
        }
      }
      src = named.src || '';
      alt = named.alt || '';

      // Build CSS classes from semantic params + backward-compat class=
      const classes: string[] = [];
      const ALIGN_MAP: Record<string, string> = {
        left: 'align-left',
        center: 'align-center',
        right: 'align-right',
      };
      if (named.align && ALIGN_MAP[named.align]) classes.push(ALIGN_MAP[named.align]);
      if (named.nozoom === 'true') classes.push('no-zoom');
      if (named.inline === 'true') classes.push('inline');
      // Backward compat: raw class= and bare known-class tokens in rest
      const KNOWN = ['align-left', 'align-right', 'align-center', 'no-zoom', 'inline'];
      if (named.class) classes.push(...named.class.split(/\s+/).filter((c) => KNOWN.includes(c)));
      for (const r of rest) {
        if (KNOWN.includes(r)) classes.push(r);
      }
      extraClass = classes.join(' ');

      const captionParts: string[] = [];
      if (named.caption) captionParts.push(named.caption);
      for (const r of rest) {
        if (!KNOWN.includes(r)) captionParts.push(r);
      }
      caption = captionParts.join(' ');

      const size = named.size || '';
      if (size) {
        const parts = size.split(/\s+/);
        width = parts[0] || '';
        height = parts[1] || '';
      }
    } else {
      // Positional mode (backward compatible):
      //   {% image src alt [caption...] [size] [class] %}
      // Parse from right to left: last arg may be a CSS class, then optional
      // height/width pixels, everything remaining is the caption text.
      src = args[0] || '';
      alt = args[1] || '';
      const trailingArgs = args.slice(2);
      let cursor = trailingArgs.length - 1; // scan from rightmost argument

      if (cursor >= 0 && /^[a-zA-Z][\w-]*$/.test(trailingArgs[cursor])) {
        extraClass = trailingArgs[cursor];
        cursor--;
      }
      if (cursor >= 0 && /^\d+$/.test(trailingArgs[cursor])) {
        height = trailingArgs[cursor];
        cursor--;
        if (cursor >= 0 && /^\d+$/.test(trailingArgs[cursor])) {
          width = trailingArgs[cursor];
          cursor--;
        } else {
          width = height;
          height = '';
        }
      }
      if (cursor >= 0) {
        caption = trailingArgs.slice(0, cursor + 1).join(' ');
      }
    }

    const lazyLoad = (hexo.theme.config as any)?.post?.image?.lazy_load !== false;

    const styles: string[] = [];
    if (width) styles.push(`width:${width}px`);
    if (height) styles.push(`height:${height}px`);
    const styleAttr = styles.length > 0 ? ` style="${styles.join(';')}"` : '';

    const figClass = extraClass ? `image-figure ${extraClass}` : 'image-figure';
    const imgClass = extraClass ? ` class="${extraClass}"` : '';
    const loadingAttr = lazyLoad ? ' loading="lazy"' : '';

    let html = `<figure class="${figClass}">`;
    html += `<img src="${src}" alt="${alt}"${loadingAttr}${imgClass}${styleAttr} onerror="this.src='/images/shion/404.png';this.classList.add('img-error')">`;
    if (caption) {
      html += `<figcaption>${caption}</figcaption>`;
    }
    html += `</figure>`;
    return html;
  });
}

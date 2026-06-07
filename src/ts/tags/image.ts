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
      src = args[0] || '';
      alt = args[1] || '';
      const tail = args.slice(2);
      let pos = tail.length - 1;

      if (pos >= 0 && /^[a-zA-Z][\w-]*$/.test(tail[pos])) {
        extraClass = tail[pos];
        pos--;
      }
      if (pos >= 0 && /^\d+$/.test(tail[pos])) {
        height = tail[pos];
        pos--;
        if (pos >= 0 && /^\d+$/.test(tail[pos])) {
          width = tail[pos];
          pos--;
        } else {
          width = height;
          height = '';
        }
      }
      if (pos >= 0) {
        caption = tail.slice(0, pos + 1).join(' ');
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

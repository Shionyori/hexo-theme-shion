/**
 * Internal post link card tag plugin — renders a styled link preview for a site post.
 */
import Hexo from 'hexo';
import { postIntro } from '../helpers/string';
import { LINK_CARD_ICONS } from './linkCardIcons';

/**
 * Hexo fills `content` / `excerpt` lazily: while a page is being rendered, a post
 * that has not been rendered yet still carries empty strings, and only its raw
 * source (`_content`) is populated. Render that source on demand — one small
 * markdown pass per card — instead of silently dropping the intro.
 */
function renderedContent(hexo: Hexo, post: Record<string, unknown>): string {
  const alreadyRendered = (post.content as string) || '';
  if (alreadyRendered) return alreadyRendered;

  const source = String(post._content ?? post.raw ?? '');
  if (!source) return '';

  try {
    return (hexo.render.renderSync({ text: source, engine: 'markdown' }) as string) || '';
  } catch {
    return '';
  }
}

export function registerPostLinkCardTag(hexo: Hexo): void {
  hexo.extend.tag.register('postLinkCard', function (args: string[], _content: string) {
    const slug = args[0];
    if (!slug) return '';

    const posts = hexo.locals.get('posts') as { data: Record<string, unknown>[] };
    if (!posts || !posts.data) return '';

    const post = posts.data.find(
      (p: Record<string, unknown>) =>
        (p.slug as string) === slug || (p.path as string)?.includes(slug),
    );

    if (!post) return `<p>Post not found: ${slug}</p>`;

    const title = post.title as string;
    // "简介", not just the `<!-- more -->` excerpt: posts without a manual
    // excerpt used to leave the description line empty. Same chain as the home
    // post cards (description → excerpt → first paragraph), see postIntro().
    const excerpt = postIntro({ ...post, content: renderedContent(hexo, post) }, 150);

    // Prefer the pre-rendered permalink: it already respects `permalink:`,
    // `pretty_urls:` and a `url` config that may or may not end in a slash.
    const base = ((hexo.config.url as string) || '').replace(/\/+$/, '');
    const url = (post.permalink as string) || `${base}/${post.path as string}`;

    // Cover: same resolution rules as the post card / hero on the post page —
    // front-matter `cover` may be site-absolute or relative to the post's asset
    // folder. The theme-wide default cover is skipped on purpose: a 72px
    // thumbnail of the same fallback image on every internal link carries no
    // information, so the slot falls back to the glyph instead.
    const cover = post.cover as string | undefined;
    const coverEnabled =
      (hexo.theme.config.post as { cover?: { enable?: boolean } } | undefined)?.cover?.enable !==
      false;
    const root = ((hexo.config.root as string) || '/').replace(/\/+$/, '');
    const coverSrc =
      coverEnabled && cover
        ? /^https?:/i.test(cover)
          ? cover
          : cover.startsWith('/')
            ? root + cover
            : `${root}/${post.path as string}${cover}`
        : '';

    const slot = coverSrc
      ? `<span class="link-card-icon link-card-icon--cover"><img src="${coverSrc}" alt="" loading="lazy" decoding="async"></span>`
      : `<span class="link-card-icon" aria-hidden="true">${LINK_CARD_ICONS.post}</span>`;

    // Same layout as {% linkCard %}: slot + text block. Only the slot content
    // and the trailing line (intro vs URL) differ — the date was dropped: on an
    // in-site link it says nothing the reader needs to decide on the click.
    return `
    <a class="tag-link-card tag-post-card" href="${url}">
      ${slot}
      <span class="link-card-body">
        <span class="link-card-title">${title}</span>
        ${excerpt ? `<span class="link-card-desc">${excerpt}</span>` : ''}
      </span>
    </a>`;
  });
}

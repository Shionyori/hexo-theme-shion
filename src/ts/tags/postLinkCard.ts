import Hexo from 'hexo';

export function registerPostLinkCardTag(hexo: Hexo): void {
  hexo.extend.tag.register('postLinkCard', function (args: string[], _content: string) {
    const slug = args[0];
    if (!slug) return '';

    const posts = hexo.locals.get('posts') as { data: Record<string, unknown>[] };
    if (!posts || !posts.data) return '';

    const post = posts.data.find((p: Record<string, unknown>) =>
      (p.slug as string) === slug || (p.path as string)?.includes(slug)
    );

    if (!post) return `<p>Post not found: ${slug}</p>`;

    const title = post.title as string;
    const excerpt = ((post.excerpt as string) || '').replace(/<[^>]*>/g, '').trim().substring(0, 150);
    const url = hexo.config.url + '/' + (post.path as string);

    return `
    <a class="tag-link-card tag-post-card" href="${url}">
      <span class="link-card-title">${title}</span>
      ${excerpt ? `<span class="link-card-desc">${excerpt}</span>` : ''}
      <span class="link-card-url">${url}</span>
    </a>`;
  });
}

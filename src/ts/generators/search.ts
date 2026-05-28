import Hexo from 'hexo';

interface SearchEntry {
  title: string;
  excerpt: string;
  url: string;
  categories: string[];
  tags: string[];
}

export function registerSearchGenerator(hexo: Hexo): void {
  hexo.extend.generator.register('search', function (locals: {
    posts: { filter: (fn: (p: Record<string, unknown>) => boolean) => { toArray: () => Record<string, unknown>[] } }
  }) {
    if (!(hexo.theme.config as any)?.search?.enable) return;

    const posts = locals.posts.filter((p) => p.published !== false).toArray();

    const index: SearchEntry[] = posts.map((post) => ({
      title: post.title as string,
      excerpt: ((post as Record<string, unknown>).excerpt as string || '').replace(/<[^>]*>/g, '').trim(),
      url: (post as Record<string, unknown>).permalink as string || ('/' + ((post as Record<string, unknown>).path as string || '')),
      categories: ((post as Record<string, unknown>).categories as { data: { name: string }[] })?.data?.map((c) => c.name) || [],
      tags: ((post as Record<string, unknown>).tags as { data: { name: string }[] })?.data?.map((t) => t.name) || [],
    }));

    return {
      path: 'search.json',
      data: JSON.stringify(index),
    };
  });
}

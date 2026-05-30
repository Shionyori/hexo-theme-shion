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
    posts: { filter: (fn: (p: Record<string, unknown>) => boolean) => { toArray: () => Record<string, unknown>[] } };
    pages: { filter: (fn: (p: Record<string, unknown>) => boolean) => { toArray: () => Record<string, unknown>[] } };
  }) {
    if (!(hexo.theme.config as any)?.search?.enable) return;

    const posts = locals.posts.filter((p) => p.published !== false).toArray();
    const pages = (locals.pages || { filter: () => ({ toArray: () => [] }) }).filter((p) => (p as Record<string, unknown>).published !== false).toArray();

    const mapEntry = (item: Record<string, unknown>): SearchEntry => ({
      title: item.title as string,
      excerpt: ((item as Record<string, unknown>).excerpt as string || '').replace(/<[^>]*>/g, '').trim(),
      url: (item as Record<string, unknown>).permalink as string || ('/' + ((item as Record<string, unknown>).path as string || '')),
      categories: ((item as Record<string, unknown>).categories as { data: { name: string }[] })?.data?.map((c) => c.name) || [],
      tags: ((item as Record<string, unknown>).tags as { data: { name: string }[] })?.data?.map((t) => t.name) || [],
    });

    const index: SearchEntry[] = [...posts.map(mapEntry), ...pages.map(mapEntry)];

    return {
      path: 'search.json',
      data: JSON.stringify(index),
    };
  });
}

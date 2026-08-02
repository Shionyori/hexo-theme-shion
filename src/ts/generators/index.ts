/**
 * Custom index generator with sticky post support.
 * Posts with `sticky: true` in frontmatter are sorted before non-sticky posts,
 * then both groups are ordered by date descending.
 *
 * This only affects the homepage generator. Tag, category, and archive pages
 * are handled by their own generators and are not affected.
 */
import Hexo from 'hexo';

export function registerIndexGenerator(hexo: Hexo): void {
  // Clear the default index generator registered by hexo-generator-index plugin
  // to avoid duplicate homepage generation.
  const store = (hexo.extend.generator as any).store;
  if (store && store.index) {
    store.index = [];
  }

  hexo.extend.generator.register(
    'index',
    function (locals: {
      posts: {
        sort: (order: string) => {
          filter: (fn: (p: Record<string, unknown>) => boolean) => {
            toArray: () => Record<string, unknown>[];
          };
        };
        filter: (fn: (p: Record<string, unknown>) => boolean) => {
          toArray: () => Record<string, unknown>[];
        };
        toArray: () => Record<string, unknown>[];
      };
    }) {
      const indexCfg = (hexo.config as any).index_generator || {};
      const perPage = indexCfg.per_page != null ? indexCfg.per_page : 10;

      // Split into sticky and non-sticky groups
      const allPosts = locals.posts.toArray();
      const stickyPosts: Record<string, unknown>[] = [];
      const normalPosts: Record<string, unknown>[] = [];

      allPosts.forEach((post) => {
        if (post.sticky) {
          stickyPosts.push(post);
        } else {
          normalPosts.push(post);
        }
      });

      // Sort each group by date descending
      const sortByDateDesc = (a: Record<string, unknown>, b: Record<string, unknown>) => {
        const da = (a.date as any)?.valueOf() || 0;
        const db = (b.date as any)?.valueOf() || 0;
        return db - da;
      };

      stickyPosts.sort(sortByDateDesc);
      normalPosts.sort(sortByDateDesc);

      const sorted = [...stickyPosts, ...normalPosts];

      // Paginate
      const paginationDir = (hexo.config as any).pagination_dir || 'page';
      const total = sorted.length;
      const totalPages = Math.ceil(total / perPage);

      const pages: { path: string; data: Record<string, unknown>; layout: string[] }[] = [];

      for (let i = 0; i < totalPages; i++) {
        const pagePosts = sorted.slice(i * perPage, (i + 1) * perPage);
        const pageNum = i + 1;

        pages.push({
          path: pageNum === 1 ? 'index.html' : `${paginationDir}/${pageNum}/index.html`,
          data: {
            __index: true,
            posts: pagePosts,
            total,
            current: pageNum,
            per_page: perPage,
            total_pages: totalPages,
            prev: pageNum > 1 ? pageNum - 1 : 0,
            next: pageNum < totalPages ? pageNum + 1 : 0,
          },
          layout: ['index'],
        });
      }

      return pages;
    },
  );
}

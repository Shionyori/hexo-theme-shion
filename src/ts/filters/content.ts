import Hexo from 'hexo';

export function registerContentFilters(hexo: Hexo): void {
  const config = (hexo.theme.config as any) || {};

  hexo.extend.filter.register('after_post_render', function (data: { content: string }) {
    if (!data.content) return data;

    if (config?.post?.image?.lazy_load) {
      data.content = data.content.replace(/<img(?!.*?loading=)/g, '<img loading="lazy"');
    }

    data.content = data.content.replace(
      /<a href="(https?:\/\/[^"]+)"(?!.*?target=)/g,
      '<a href="$1" target="_blank" rel="noopener"'
    );

    return data;
  });
}

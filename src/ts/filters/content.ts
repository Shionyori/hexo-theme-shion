import Hexo from 'hexo';

export function registerContentFilters(hexo: Hexo): void {
  const config = (hexo.theme.config as any) || {};

  hexo.extend.filter.register('after_post_render', function (data: { content: string }) {
    if (!data.content) return data;

    // Lazy load images
    if (config?.post?.image?.lazy_load) {
      data.content = data.content.replace(/<img(?!.*?loading=)/g, '<img loading="lazy"');
    }

    // Fancybox lightbox: wrap images in links
    if (config?.post?.image?.fancybox) {
      data.content = data.content.replace(
        /<img(?: (?!loading=)[^>]*)? src="([^"]+)"(?: (?!loading=)[^>]*)?(?: alt="([^"]*)")?[^>]*>/g,
        (match: string, src: string, alt: string) => {
          if (match.includes('data-fancybox')) return match;
          const caption = alt || '';
          return `<a href="${src}" data-fancybox="gallery" data-caption="${caption}">${match}</a>`;
        }
      );
    }

    // External links target="_blank"
    data.content = data.content.replace(
      /<a href="(https?:\/\/[^"]+)"(?!.*?target=)/g,
      '<a href="$1" target="_blank" rel="noopener"'
    );

    return data;
  });
}

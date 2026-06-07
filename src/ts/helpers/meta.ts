/**
 * SEO meta tag helpers — Open Graph, Twitter Cards, JSON-LD structured data, canonical URLs.
 */
import Hexo from 'hexo';

export function registerMetaHelpers(hexo: Hexo): void {
  hexo.extend.helper.register('open_graph', function (page: Record<string, unknown>) {
    const config = this.config;
    const og = {
      'og:title': page.title || config.title,
      'og:type': page.layout === 'post' ? 'article' : 'website',
      'og:url': config.url + '/' + (page.path || ''),
      'og:site_name': config.title,
    };

    return Object.entries(og)
      .map(([k, v]) => `<meta property="${k}" content="${escapeAttr(v as string)}">`)
      .join('\n');
  });

  hexo.extend.helper.register('twitter_card', function (page: Record<string, unknown>) {
    return [
      '<meta name="twitter:card" content="summary">',
      `<meta name="twitter:title" content="${escapeAttr((page.title || this.config.title) as string)}">`,
    ].join('\n');
  });

  hexo.extend.helper.register('structured_data', function (_page: Record<string, unknown>) {
    const config = this.config;
    const json = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: config.title,
      url: config.url,
    };
    return `<script type="application/ld+json">${JSON.stringify(json)}</script>`;
  });

  hexo.extend.helper.register('canonical_url', function (page: Record<string, unknown>) {
    return this.config.url + '/' + (page.path || '');
  });
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

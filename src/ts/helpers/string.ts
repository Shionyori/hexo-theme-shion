/**
 * String/content helpers — excerpt, word count, reading time, HTML stripping.
 */
import Hexo from 'hexo';

function decodeEntities(html: string): string {
  return html
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function cleanText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Fields a post needs to supply for `postIntro`. */
export interface IntroSource {
  description?: unknown;
  excerpt?: unknown;
  content?: unknown;
}

/**
 * The site's definition of a post "简介", shared by the home post cards and the
 * `{% postLinkCard %}` tag so both always read the same:
 *
 *   1. front-matter `description` — the author's own wording
 *   2. the `<!-- more -->` excerpt
 *   3. the first paragraph of the rendered content
 *
 * Returns plain text (entities decoded, tags stripped, whitespace collapsed).
 */
export function postIntro(post: IntroSource, maxLen = 150): string {
  const description = cleanText(String(post.description ?? ''));
  const excerpt = cleanText(String(post.excerpt ?? ''));
  const content = String(post.content ?? '');
  const pMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);

  const text = description || excerpt || cleanText(pMatch ? pMatch[1] : content);
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

export function registerStringHelpers(hexo: Hexo): void {
  // Post "简介" as the post cards render it — keeps the template free of the
  // description/excerpt/first-paragraph chain defined in postIntro().
  hexo.extend.helper.register('post_intro', function (post: IntroSource) {
    const maxLen = (this as any).theme.home?.excerpt_length || 280;
    return postIntro(post, maxLen);
  });

  hexo.extend.helper.register('excerpt', function (content: string, length?: number) {
    const maxLen = length || (this as any).theme.home?.excerpt_length || 280;
    // Extract first <p> from rendered HTML, or fall back to full content
    const pMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);
    const text = cleanText(pMatch ? pMatch[1] : content);
    if (text.length <= maxLen) return text;
    return text.substring(0, maxLen) + '...';
  });

  hexo.extend.helper.register('word_count', function (content: string) {
    const text = cleanText(content);
    const cn = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
    const en = (text.match(/[a-zA-Z0-9]+/g) || []).length;
    const total = cn + en;
    const __ = (this as any).__;
    // Labels live in languages/*.yml so CJK sites read `%s 字` instead of `%s words`.
    if (typeof __ === 'function') return __(total === 1 ? 'word' : 'words', total);
    return total + ' ' + (total === 1 ? 'word' : 'words');
  });

  hexo.extend.helper.register('reading_time', function (content: string) {
    const text = cleanText(content);
    const cn = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
    const en = (text.match(/[a-zA-Z0-9]+/g) || []).length;
    const minutes = Math.max(1, Math.ceil(cn / 300 + en / 200));
    const __ = (this as any).__;
    if (typeof __ === 'function') return __('min_read', minutes);
    return minutes + ' min read';
  });

  hexo.extend.helper.register('strip_html', function (html: string): string {
    return cleanText(html);
  });
}

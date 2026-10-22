/**
 * Marked.js extension that adds support for the `==highlight==` syntax.
 * Renders as `<mark>highlight</mark>` in HTML.
 *
 * This mirrors the behavior of the markdown-it-mark plugin so users familiar
 * with Obsidian, Typora, or other editors that support `==text==` can use it
 * without switching their writing habits.
 */
import Hexo from 'hexo';

/**
 * Register a custom marked extension for `==text==` syntax.
 *
 * The extension hooks into the `marked:extensions` filter provided by
 * `hexo-renderer-marked` (v7+), which passes extensions directly to
 * `marked.use({ extensions })`.
 */
export function registerMarkExtension(hexo: Hexo): void {
  hexo.extend.filter.register('marked:extensions', function (extensions: any[]) {
    extensions.push({
      name: 'mark',
      level: 'inline',
      start(src: string): number {
        return src.indexOf('==');
      },
      tokenizer(src: string): any {
        // Match ==text== where text is one or more characters
        // that are not a double-equals sequence.
        // Allows single `=` signs inside the highlighted text.
        const rule = /^==((?:[^=]|=(?!=))+?)==/;
        const match = rule.exec(src);
        if (match) {
          const text = match[1];
          return {
            type: 'mark',
            raw: match[0],
            text,
            // Parse nested inline syntax inside the highlighted text so
            // things like ==**bold**== or ==`code`== render correctly
            // instead of leaking their literal markup.
            tokens: this.lexer.inlineTokens(text),
          };
        }
        return undefined;
      },
      renderer(token: any): string {
        const content = token.tokens ? this.parser.parseInline(token.tokens) : token.text;
        return `<mark>${content}</mark>`;
      },
    });
  });
}

/**
 * hexo-theme-shion — Main entry point.
 * Registers all Hexo extensions: helpers, filters, generators, and tag plugins.
 */
import Hexo from 'hexo';
import { registerStringHelpers } from './helpers/string.js';
import { registerDateHelpers } from './helpers/date.js';
import { registerMetaHelpers } from './helpers/meta.js';
import { registerUtilHelpers } from './helpers/util.js';
import { registerContentFilters } from './filters/content.js';
import { registerSearchGenerator } from './generators/search.js';
import { register404Generator } from './generators/404.js';
import { registerNoteTag } from './tags/note.js';
import { registerImageTag } from './tags/image.js';
import { registerQuoteTag } from './tags/quote.js';
import { registerTabsTag } from './tags/tabs.js';
import { registerDetailsTag } from './tags/details.js';

import { registerLinkCardTag } from './tags/linkCard.js';
import { registerPostLinkCardTag } from './tags/postLinkCard.js';

declare const hexo: Hexo;

// Enable hljs-prefixed CSS class names so our syntax highlighting CSS can target tokens.
(hexo.config.highlight as any).hljs = true;

registerStringHelpers(hexo);
registerDateHelpers(hexo);
registerMetaHelpers(hexo);
registerUtilHelpers(hexo);
registerContentFilters(hexo);
registerSearchGenerator(hexo);
register404Generator(hexo);
registerNoteTag(hexo);
registerImageTag(hexo);
registerQuoteTag(hexo);
registerTabsTag(hexo);
registerDetailsTag(hexo);

registerLinkCardTag(hexo);
registerPostLinkCardTag(hexo);

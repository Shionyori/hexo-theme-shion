import Hexo from 'hexo';
import { registerStringHelpers } from './helpers/string';
import { registerDateHelpers } from './helpers/date';
import { registerMetaHelpers } from './helpers/meta';
import { registerUtilHelpers } from './helpers/util';
import { registerContentFilters } from './filters/content';
import { registerSearchGenerator } from './generators/search';
import { registerNoteTag } from './tags/note';
import { registerImageTag } from './tags/image';
import { registerQuoteTag } from './tags/quote';

declare const hexo: Hexo;

registerStringHelpers(hexo);
registerDateHelpers(hexo);
registerMetaHelpers(hexo);
registerUtilHelpers(hexo);
registerContentFilters(hexo);
registerSearchGenerator(hexo);
registerNoteTag(hexo);
registerImageTag(hexo);
registerQuoteTag(hexo);

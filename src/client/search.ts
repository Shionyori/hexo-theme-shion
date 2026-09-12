/**
 * Local search overlay — Fuse.js full-text search with keyboard shortcuts (Ctrl/Cmd+K).
 * Loads search.json asynchronously and matches against metadata as well as the full
 * article body, rendering a context snippet around the first in-content hit.
 * Supports debounced input and animated results.
 */
import { $, on } from './utils';

interface SearchItem {
  title: string;
  excerpt: string;
  content?: string;
  url: string;
  categories: string[];
  tags: string[];
  type: 'post' | 'page';
}

interface FuseMatch {
  key: string;
  indices: [number, number][];
  value?: string;
}

interface FuseResult {
  item: SearchItem;
  matches?: FuseMatch[];
}

let searchIndex: SearchItem[] = [];
let fuseInstance: { search: (q: string) => FuseResult[] } | null = null;
let indexPromise: Promise<void> | null = null;

// Snippet window (characters) around the first match inside the article body.
const SNIPPET_CONTEXT_BEFORE = 30;
const SNIPPET_LENGTH = 140;

async function loadSearchIndex(indexUrl: string): Promise<void> {
  if (fuseInstance) return;

  const resp = await fetch(indexUrl);
  if (!resp.ok) throw new Error(`Search index not found (${resp.status})`);
  const raw = await resp.json();

  searchIndex = raw.map((item: SearchItem) => ({
    ...item,
    excerpt: item.excerpt || '',
    content: item.content || '',
    type: item.type || 'post',
  }));

  const FuseModule = await import('fuse.js');
  const Fuse = FuseModule.default;
  fuseInstance = new Fuse(searchIndex, {
    keys: [
      { name: 'title', weight: 3 },
      { name: 'tags', weight: 2 },
      { name: 'categories', weight: 2 },
      { name: 'excerpt', weight: 1.5 },
      { name: 'content', weight: 1 },
    ],
    // Article bodies are long, so a keyword can appear anywhere — without this
    // Fuse only scores matches near the start of each field.
    ignoreLocation: true,
    threshold: 0.3,
    minMatchCharLength: 2,
    includeMatches: true,
  });
}

/**
 * Loads the index at most once. A failed attempt clears the cached promise so the
 * next keystroke retries, and callers can `await` it to avoid searching too early.
 */
function ensureSearchIndex(indexUrl: string): Promise<void> {
  if (!indexPromise) {
    indexPromise = loadSearchIndex(indexUrl).catch((err) => {
      console.warn('Search index could not be loaded', err);
      indexPromise = null;
    });
  }
  return indexPromise;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

interface Range {
  start: number;
  end: number;
}

/** Merge overlapping or adjacent match ranges into a sorted, minimal set. */
function normalizeRanges(indices: [number, number][]): Range[] {
  const sorted = indices
    .map(([a, b]) => ({ start: Math.min(a, b), end: Math.max(a, b) }))
    .sort((a, b) => a.start - b.start);

  const merged: Range[] = [];
  for (const range of sorted) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end + 1) {
      last.end = Math.max(last.end, range.end);
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

/**
 * Escapes `text` and wraps the matched ranges in <mark>. `offset` is the index of
 * `text[0]` within the full field value (used when rendering a snippet window).
 */
function highlight(text: string, ranges: Range[], offset = 0): string {
  let html = '';
  let cursor = 0;

  for (const range of ranges) {
    const start = Math.max(0, range.start - offset);
    const end = Math.min(text.length, range.end - offset + 1);
    if (end <= 0 || start >= text.length || end <= start) continue;

    if (start > cursor) html += escapeHtml(text.slice(cursor, start));
    html += `<mark class="search-match">${escapeHtml(text.slice(start, end))}</mark>`;
    cursor = end;
  }

  if (cursor < text.length) html += escapeHtml(text.slice(cursor));
  return html;
}

/** Build a highlighted preview, centred on the first match of the given field. */
function buildSnippet(match: FuseMatch | undefined, fallback: string): string {
  if (!match || !match.indices.length || !match.value) {
    return escapeHtml(fallback);
  }

  const ranges = normalizeRanges(match.indices);
  const first = ranges[0];
  const from = Math.max(0, first.start - SNIPPET_CONTEXT_BEFORE);
  const to = Math.min(match.value.length, from + SNIPPET_LENGTH);
  const prefix = from > 0 ? '…' : '';
  const suffix = to < match.value.length ? '…' : '';

  return prefix + highlight(match.value.slice(from, to), ranges, from) + suffix;
}

function renderInfo(query: string, count: number, overlay: Element): string {
  const keyword = `<span class="search-highlight">${escapeHtml(query)}</span>`;
  const countHtml = `<span class="search-highlight">${count}</span>`;
  const i18nFound =
    overlay.getAttribute('data-i18n-found') || 'Found {count} result(s) for «{query}»';
  const i18nNotFound =
    overlay.getAttribute('data-i18n-not-found') || 'No results found for «{query}»';

  const template = count > 0 ? i18nFound : i18nNotFound;
  return template.replace('{query}', keyword).replace('{count}', countHtml);
}

function renderResultItems(results: FuseResult[]): string {
  return results
    .map((r) => {
      const titleMatch = r.matches?.find((m) => m.key === 'title' && m.indices.length);
      const title = titleMatch?.value
        ? highlight(titleMatch.value, normalizeRanges(titleMatch.indices))
        : escapeHtml(r.item.title);

      // Prefer an in-body match so the snippet reflects *why* the post matched,
      // and fall back to the excerpt when the hit was in the title/taxonomies.
      const contentMatch = r.matches?.find((m) => m.key === 'content' && m.indices.length);
      const excerptMatch = r.matches?.find((m) => m.key === 'excerpt' && m.indices.length);
      const fallback = r.item.excerpt || (r.item.content || '').slice(0, 160);
      const snippet = buildSnippet(contentMatch || excerptMatch, fallback);

      const excerpt = snippet ? `<div class="search-result-excerpt">${snippet}</div>` : '';

      return `
        <a class="search-result-item" href="${escapeHtml(r.item.url)}">
          <div class="search-result-title">${title}</div>
          ${excerpt}
        </a>`;
    })
    .join('');
}

export function initSearch(): void {
  const searchOverlay = $('#search-overlay');
  const searchInput = $('#search-input') as HTMLInputElement | null;
  const searchResults = $('#search-results');
  const searchInfo = $('#search-info');
  const searchToggle = $('#search-toggle');
  const searchClose = $('#search-close');

  if (!searchOverlay || !searchInput || !searchResults) return;

  const indexUrl = searchOverlay.getAttribute('data-index-url') || '/search.json';
  ensureSearchIndex(indexUrl); // warm up the index as soon as the page loads

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let searchSeq = 0;

  function closeSearch(): void {
    if (searchOverlay.classList.contains('is-closing')) return;

    searchSeq++; // discard any in-flight search still resolving
    searchOverlay.classList.add('is-closing');

    // Clean up after close animation completes
    setTimeout(() => {
      searchOverlay.classList.remove('is-open', 'is-closing');
      document.body.style.overflow = '';
      searchInput.value = '';
      searchResults.innerHTML = '';
      if (searchInfo) searchInfo.innerHTML = '';
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    }, 200);
  }

  on(searchToggle!, 'click', () => {
    if (searchOverlay.classList.contains('is-closing')) return;
    searchOverlay.classList.remove('is-closing');
    searchOverlay.classList.add('is-open');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  });

  on(searchClose!, 'click', closeSearch);

  // Close the overlay when a result is followed so PJAX swaps in a visible page.
  on(searchResults, 'click', (e) => {
    if ((e.target as HTMLElement).closest('.search-result-item')) closeSearch();
  });

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) {
      closeSearch();
    }
    if (
      e.key === 'k' &&
      (e.ctrlKey || e.metaKey) &&
      !searchOverlay.classList.contains('is-open') &&
      !searchOverlay.classList.contains('is-closing')
    ) {
      e.preventDefault();
      searchOverlay.classList.remove('is-closing');
      searchOverlay.classList.add('is-open');
      searchInput.focus();
      document.body.style.overflow = 'hidden';
    }
  });

  on(searchInput, 'input', () => {
    const query = searchInput.value.trim();

    // Clear immediately when query is too short
    if (query.length < 2) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      if (searchInfo) searchInfo.innerHTML = '';
      searchResults.innerHTML = '';
      return;
    }

    // Debounce the actual search to avoid flicker on rapid typing
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      debounceTimer = null;

      // Make sure the index is ready before the first query, and discard the
      // response if a newer keystroke has superseded this one.
      const seq = ++searchSeq;
      await ensureSearchIndex(indexUrl);
      if (seq !== searchSeq) return;

      const allResults = fuseInstance ? fuseInstance.search(query) : [];
      const fuseResults = allResults.slice(0, 10);

      if (searchInfo) {
        searchInfo.innerHTML = renderInfo(query, allResults.length, searchOverlay);
      }

      if (fuseResults.length > 0) {
        searchResults.innerHTML = renderResultItems(fuseResults);
        // Delay enabling CSS transitions until after the first paint,
        // otherwise the ::before bar animates from browser defaults and "jumps".
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            searchResults.querySelectorAll('.search-result-item').forEach((el) => {
              el.classList.add('is-mounted');
            });
          });
        });
      } else {
        searchResults.innerHTML = '';
      }
    }, 150);
  });
}

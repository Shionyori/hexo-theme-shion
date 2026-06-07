/**
 * Local search overlay — Fuse.js full-text search with keyboard shortcuts (Ctrl/Cmd+K).
 * Loads search.json asynchronously. Supports debounced input and animated results.
 */
import { $, on } from './utils';

interface SearchItem {
  title: string;
  excerpt: string;
  url: string;
  categories: string[];
  tags: string[];
  type: 'post' | 'page';
}

let searchIndex: SearchItem[] = [];
let fuseInstance: { search: (q: string) => { item: SearchItem }[] } | null = null;

async function loadSearchIndex(): Promise<void> {
  if (searchIndex.length > 0) return;

  try {
    const resp = await fetch('/search.json');
    if (!resp.ok) throw new Error('Search index not found');
    const raw = await resp.json();

    searchIndex = raw.map((item: SearchItem) => ({
      ...item,
      excerpt: item.excerpt || '',
      type: item.type || 'post',
    }));

    const FuseModule = await import('fuse.js');
    const Fuse = FuseModule.default;
    fuseInstance = new Fuse(searchIndex, {
      keys: ['title', 'excerpt', 'categories', 'tags'],
      threshold: 0.3,
      includeMatches: true,
    });
  } catch {
    console.warn('Search index could not be loaded');
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function renderInfo(query: string, count: number): string {
  const keyword = `<span class="search-highlight">${escapeHtml(query)}</span>`;
  if (count > 0) {
    return `关于「${keyword}」，找到了 <span class="search-highlight">${count}</span> 条记录`;
  }
  return `关于「${keyword}」，没有找到任何记录呢`;
}

function renderResultItems(results: { item: SearchItem }[]): string {
  return results
    .map((r) => {
      const excerpt = r.item.excerpt
        ? `<div class="search-result-excerpt">${escapeHtml(r.item.excerpt)}</div>`
        : '';

      return `
        <a class="search-result-item" href="${escapeHtml(r.item.url)}">
          <div class="search-result-title">${escapeHtml(r.item.title)}</div>
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

  loadSearchIndex();

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function closeSearch(): void {
    if (searchOverlay.classList.contains('is-closing')) return;

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
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      const fuseResults = fuseInstance ? fuseInstance.search(query).slice(0, 10) : [];

      if (searchInfo) {
        searchInfo.innerHTML = renderInfo(query, fuseResults.length);
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

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
  const overlay = $('#search-overlay');
  const input = $('#search-input') as HTMLInputElement | null;
  const results = $('#search-results');
  const info = $('#search-info');
  const toggle = $('#search-toggle');
  const close = $('#search-close');

  if (!overlay || !input || !results) return;

  loadSearchIndex();

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function closeSearch(): void {
    if (overlay.classList.contains('is-closing')) return;

    overlay.classList.add('is-closing');

    // Clean up after close animation completes
    setTimeout(() => {
      overlay.classList.remove('is-open', 'is-closing');
      document.body.style.overflow = '';
      input.value = '';
      results.innerHTML = '';
      if (info) info.innerHTML = '';
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    }, 200);
  }

  on(toggle!, 'click', () => {
    if (overlay.classList.contains('is-closing')) return;
    overlay.classList.remove('is-closing');
    overlay.classList.add('is-open');
    input.focus();
    document.body.style.overflow = 'hidden';
  });

  on(close!, 'click', closeSearch);

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeSearch();
    }
    if (e.key === 'k' && (e.ctrlKey || e.metaKey) && !overlay.classList.contains('is-open') && !overlay.classList.contains('is-closing')) {
      e.preventDefault();
      overlay.classList.remove('is-closing');
      overlay.classList.add('is-open');
      input.focus();
      document.body.style.overflow = 'hidden';
    }
  });

  on(input, 'input', () => {
    const query = input.value.trim();

    // Clear immediately when query is too short
    if (query.length < 2) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      if (info) info.innerHTML = '';
      results.innerHTML = '';
      return;
    }

    // Debounce the actual search to avoid flicker on rapid typing
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      const fuseResults = fuseInstance ? fuseInstance.search(query).slice(0, 10) : [];

      if (info) {
        info.innerHTML = renderInfo(query, fuseResults.length);
      }

      if (fuseResults.length > 0) {
        results.innerHTML = renderResultItems(fuseResults);
        // Delay enabling CSS transitions until after the first paint,
        // otherwise the ::before bar animates from browser defaults and "jumps".
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            results.querySelectorAll('.search-result-item').forEach((el) => {
              el.classList.add('is-mounted');
            });
          });
        });
      } else {
        results.innerHTML = '';
      }
    }, 150);
  });
}

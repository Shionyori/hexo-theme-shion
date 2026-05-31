import { $, on } from './utils';

interface SearchItem {
  title: string;
  excerpt: string;
  url: string;
  categories: string[];
  tags: string[];
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

function renderResults(query: string): string {
  if (!fuseInstance) return '';

  const results = fuseInstance.search(query).slice(0, 10);

  if (results.length === 0) {
    return (
      '<div class="search-empty">' + (window.__searchEmptyText || 'No results found.') + '</div>'
    );
  }

  return results
    .map(
      (r) => `
      <a class="search-result-item" href="${r.item.url}">
        <div class="search-result-title">${escapeHtml(r.item.title)}</div>
        <div class="search-result-excerpt">${escapeHtml(r.item.excerpt).substring(0, 120)}</div>
      </a>`,
    )
    .join('');
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function initSearch(): void {
  const overlay = $('#search-overlay');
  const input = $('#search-input') as HTMLInputElement | null;
  const results = $('#search-results');
  const toggle = $('#search-toggle');
  const close = $('#search-close');

  if (!overlay || !input || !results) return;

  loadSearchIndex();

  on(toggle!, 'click', () => {
    overlay.classList.add('is-open');
    input.focus();
    document.body.style.overflow = 'hidden';
  });

  on(close!, 'click', () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
  });

  on(overlay, 'click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      input.value = '';
      results.innerHTML = '';
    }
  });

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      input.value = '';
      results.innerHTML = '';
    }
    if (e.key === 'k' && (e.ctrlKey || e.metaKey) && !overlay.classList.contains('is-open')) {
      e.preventDefault();
      overlay.classList.add('is-open');
      input.focus();
      document.body.style.overflow = 'hidden';
    }
  });

  on(input, 'input', () => {
    const query = input.value.trim();
    if (query.length < 2) {
      results.innerHTML = '';
      return;
    }
    results.innerHTML = renderResults(query);
  });
}

declare global {
  interface Window {
    __searchEmptyText?: string;
  }
}

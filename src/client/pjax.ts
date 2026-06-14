/**
 * PJAX navigation — intercepts internal links, fetches target page via AJAX,
 * replaces only the #pjax-container, keeps sidebar + music player alive.
 */

let isNavigating = false;
let progressEl: HTMLElement | null = null;
let progressTimer: ReturnType<typeof setInterval> | null = null;
const TIMEOUT_MS = 10000;

// ── Progress bar ────────────────────────────────────────────

function ensureProgress(): HTMLElement {
  if (!progressEl) {
    progressEl = document.createElement('div');
    progressEl.className = 'pjax-progress';
    document.body.appendChild(progressEl);
  }
  return progressEl;
}

function showProgress(): void {
  const el = ensureProgress();
  el.classList.remove('is-done');
  el.classList.add('is-active');
  el.style.width = '0%';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.width = '20%';
    });
  });

  let width = 20;
  progressTimer = setInterval(() => {
    if (width < 80) {
      width += (80 - width) * 0.08;
      el.style.width = width + '%';
    }
  }, 200);
}

function completeProgress(): void {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  if (progressEl) {
    progressEl.style.width = '100%';
    progressEl.classList.add('is-done');
    progressEl.classList.remove('is-active');
  }
}

// ── Link filtering ──────────────────────────────────────────

function shouldIntercept(link: HTMLAnchorElement): boolean {
  // Must be HTTP(S)
  if (link.protocol !== 'http:' && link.protocol !== 'https:') return false;
  // Same origin only
  if (link.origin !== location.origin) return false;
  // Not a download
  if (link.hasAttribute('download')) return false;
  // Not target="_blank"
  if (link.target === '_blank') return false;
  // Not with data-no-pjax
  if (link.getAttribute('data-no-pjax') !== null) return false;
  // Hash-only navigation on the same page — let browser handle
  if (link.href === location.href && link.hash) return false;
  // Exclude links inside music player (they have their own behavior)
  if (link.closest('.music-player')) return false;

  return true;
}

// ── Navigation ──────────────────────────────────────────────

async function navigateTo(url: string, addToHistory: boolean): Promise<void> {
  if (isNavigating) return;
  isNavigating = true;

  showProgress();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const newContainer = doc.querySelector('#pjax-container');
    const currentContainer = document.querySelector('#pjax-container');

    if (!newContainer || !currentContainer) {
      // Fallback: full page navigation
      location.href = url;
      return;
    }

    // Replace content
    currentContainer.replaceWith(newContainer);

    // Update page title
    if (doc.title) {
      document.title = doc.title;
    }

    // Update body classes from the new page
    document.body.className = doc.body.className || '';

    // Update URL
    if (addToHistory) {
      history.pushState({ pjax: true }, doc.title || '', url);
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Complete progress bar
    completeProgress();

    // Notify content modules to re-initialize
    document.dispatchEvent(new CustomEvent('pjax:complete', { detail: { url } }));
  } catch {
    // Network error, timeout, or non-2xx: fallback to full navigation
    if (progressEl) {
      progressEl.classList.remove('is-active', 'is-done');
      progressEl.style.width = '0%';
    }
    location.href = url;
  } finally {
    clearTimeout(timeoutId);
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    isNavigating = false;
  }
}

// ── Event binding ───────────────────────────────────────────

export function initPjax(): void {
  // Intercept all link clicks (event delegation on document)
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
      if (!link) return;

      if (!shouldIntercept(link)) return;

      // Don't intercept modified clicks (ctrl+click, middle-click, etc.)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;

      e.preventDefault();
      navigateTo(link.href, true);
    },
    { capture: false },
  );

  // Handle back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state?.pjax) {
      navigateTo(location.href, false);
    }
    // If state is null (non-PJAX page in history), browser handles the full navigation
  });
}

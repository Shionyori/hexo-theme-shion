/**
 * Busuanzi visitor counters.
 *
 * Two problems this solves:
 *
 * 1. PJAX only swaps `#pjax-container`, so the vendor script emitted in the
 *    footer never runs again. Every in-site navigation would go uncounted
 *    (site_pv / page_pv only tracked the landing page). Re-injecting the script
 *    after each swap fires a fresh JSONP request whose Referer is the current
 *    URL — which is exactly what the service counts.
 * 2. When the service is blocked or unreachable, the `-` placeholders stay on
 *    screen forever. Hide the counters instead of showing broken markup.
 *
 * Markup contract (see layout/_partial/busuanzi.ejs + post-meta.ejs):
 *   [data-busuanzi]        wrapper to hide when unavailable
 *   [data-busuanzi-value]  value node, `-` until the service responds
 *   script[data-busuanzi-script]  the vendor script tag, replaced on each swap
 */

const SCRIPT_SRC = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
const PLACEHOLDER = '-';
const FALLBACK_MS = 8000;

let initialized = false;
let fallbackTimer: number | null = null;

function roots(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-busuanzi]'));
}

function valuesOf(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-busuanzi-value]'));
}

function isPending(el: HTMLElement): boolean {
  return (el.textContent || '').trim() === PLACEHOLDER;
}

/** Hide counters that never received a value; un-hide the ones that did. */
function settle(): void {
  fallbackTimer = null;

  roots().forEach((root) => {
    const values = valuesOf(root);
    if (values.length === 0) return;
    root.classList.toggle('is-unavailable', values.every(isPending));
  });
}

function armFallback(): void {
  if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
  fallbackTimer = window.setTimeout(settle, FALLBACK_MS);
}

/** Swap the vendor script for a fresh tag so it re-runs against the new URL. */
function reload(): void {
  roots().forEach((root) => root.classList.remove('is-unavailable'));

  const script = document.createElement('script');
  script.src = SCRIPT_SRC;
  script.async = true;
  script.dataset.busuanziScript = '';
  // Both the vendor script and its JSONP response are third-party requests:
  // an ad blocker or network failure leaves the placeholders untouched.
  script.addEventListener('error', settle);

  const previous = document.querySelector<HTMLScriptElement>('script[data-busuanzi-script]');
  if (previous && previous.parentNode) {
    previous.parentNode.replaceChild(script, previous);
  } else {
    document.body.appendChild(script);
  }

  // Drop JSONP callbacks still in flight from the previous page, otherwise a late
  // response could write the old post's numbers into the freshly swapped nodes.
  document
    .querySelectorAll<HTMLScriptElement>('script[src*="busuanzi.ibruce.info/busuanzi?"]')
    .forEach((el) => el.remove());

  armFallback();
}

/**
 * Runs on DOMContentLoaded and after every PJAX swap.
 * The first call must NOT reload: the template already emitted the script tag,
 * reloading here would count the initial page view twice.
 */
export function initStats(): void {
  if (roots().length === 0) return; // busuanzi disabled on this page

  if (!initialized) {
    initialized = true;
    armFallback();
    return;
  }

  reload();
}

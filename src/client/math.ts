/**
 * Dynamic KaTeX loading — handles PJAX navigation to math pages
 * when KaTeX hasn't been loaded on the initial page.
 */

let katexReady = false;

function hasMathDelimiters(el: Element): boolean {
  return /\$\$|\\\[|\\\(|\$/.test(el.innerHTML);
}

function renderMathInTargets(): void {
  const win = window as any;
  if (typeof win.renderMathInElement !== 'function') return;

  const targets = document.querySelectorAll('.post-content, .page-content');
  if (!targets.length) return;

  const config = (window as any).__shionConfig || {};
  const delimiters = config.katexDelimiters || [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false },
  ];

  targets.forEach((el) => {
    if (!hasMathDelimiters(el)) return;
    // Pre-process <br> tags within math blocks
    let html = el.innerHTML;
    html = html.replace(
      /(\$\$)([\s\S]*?)(\$\$)/g,
      (_, open: string, body: string, close: string) => {
        return open + body.replace(/<br\s*\/?>/gi, '\n') + close;
      },
    );
    html = html.replace(
      /(\\\[)([\s\S]*?)(\\\])/g,
      (_, open: string, body: string, close: string) => {
        return open + body.replace(/<br\s*\/?>/gi, '\n') + close;
      },
    );
    el.innerHTML = html;

    win.renderMathInElement(el, {
      delimiters,
      ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      throwOnError: false,
    });
  });
}

export function initMath(): void {
  const targets = document.querySelectorAll('.post-content, .page-content');
  if (!targets.length) return;

  // Check if any target has math
  let hasMath = false;
  targets.forEach((el) => {
    if (hasMathDelimiters(el)) hasMath = true;
  });
  if (!hasMath) return;

  // Already loaded
  if (katexReady) {
    renderMathInTargets();
    return;
  }

  const config = (window as any).__shionConfig || {};
  const cdn = config.katexCDN || 'https://cdn.jsdelivr.net/npm/katex@0.16.9';

  // Check if KaTeX CSS is already in the document
  if (!document.querySelector('link[href*="katex.min.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${cdn}/dist/katex.min.css`;
    document.head.appendChild(link);
  }

  // Check if KaTeX JS is already loaded
  if (typeof (window as any).renderMathInElement === 'function') {
    katexReady = true;
    renderMathInTargets();
    return;
  }

  // Load KaTeX JS dynamically
  const script = document.createElement('script');
  script.src = `${cdn}/dist/katex.min.js`;
  script.onload = () => {
    // Load auto-render extension
    const autoRender = document.createElement('script');
    autoRender.src = `${cdn}/dist/contrib/auto-render.min.js`;
    autoRender.onload = () => {
      katexReady = true;
      renderMathInTargets();
    };
    document.body.appendChild(autoRender);
  };
  document.body.appendChild(script);
}

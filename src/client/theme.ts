import { $, on } from './utils';

const STORAGE_KEY = 'shion-theme';

function getPreferredMode(): 'dark' | 'light' {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: 'dark' | 'light'): void {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

function updateGiscusTheme(mode: 'dark' | 'light'): void {
  const iframe = document.querySelector<HTMLIFrameElement>('.giscus-frame');
  if (!iframe) return;

  const theme = mode === 'dark' ? 'dark' : 'light';
  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme } } },
    'https://giscus.app'
  );
}

export function initTheme(): void {
  const mode = getPreferredMode();
  applyTheme(mode);

  const toggle = $('#theme-toggle');
  if (!toggle) return;

  on(toggle, 'click', () => {
    const current = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    updateGiscusTheme(next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

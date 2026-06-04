import { $, on } from './utils';

const STORAGE_KEY = 'shion-theme';
const TRANSITION_CLASS = 'theme-transitioning';
const TRANSITION_DURATION = 400;

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
  iframe.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
}

function toggleTheme(): void {
  const html = document.documentElement;
  const current = html.hasAttribute('data-theme') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  // Add transition class for smooth color animation
  html.classList.add(TRANSITION_CLASS);

  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
  updateGiscusTheme(next);

  // Remove transition class after animation completes
  setTimeout(() => {
    html.classList.remove(TRANSITION_CLASS);
  }, TRANSITION_DURATION);
}

export function initTheme(): void {
  const mode = getPreferredMode();
  applyTheme(mode);

  const toggle = $('#theme-toggle');
  if (!toggle) return;

  on(toggle, 'click', () => {
    toggleTheme();
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const html = document.documentElement;
      html.classList.add(TRANSITION_CLASS);
      const nextMode = e.matches ? 'dark' : 'light';
      applyTheme(nextMode);
      setTimeout(() => {
        html.classList.remove(TRANSITION_CLASS);
      }, TRANSITION_DURATION);
    }
  });
}

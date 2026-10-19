/**
 * Theme toggle — dark/light mode with localStorage persistence and system preference detection.
 * Uses the View Transitions API for a circular reveal expanding from the toggle button where
 * supported, falling back to a smooth colour cross-fade. Emits a `themeChanged` event so
 * embedded widgets (comments, etc.) can follow the active theme.
 */
import { $, on } from './utils';

const STORAGE_KEY = 'shion-theme';
const TRANSITION_CLASS = 'theme-transitioning';
const TRANSITION_DURATION = 400;

interface ViewTransitionHandle {
  ready: Promise<void>;
  finished: Promise<void>;
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => ViewTransitionHandle;
};

// Guards against starting a second View Transition while one is animating.
let viewTransitionBusy = false;

function getPreferredMode(): 'dark' | 'light' {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(mode: 'dark' | 'light'): void {
  document.documentElement.setAttribute('data-theme', mode);
  document.dispatchEvent(new CustomEvent<string>('themeChanged', { detail: mode }));
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Fallback: temporarily enable colour transitions on every element. */
function crossFadeTheme(apply: () => void): void {
  const html = document.documentElement;
  html.classList.add(TRANSITION_CLASS);
  apply();
  setTimeout(() => html.classList.remove(TRANSITION_CLASS), TRANSITION_DURATION);
}

function toggleTheme(): void {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';

  const apply = (): void => {
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const doc = document as DocumentWithViewTransition;
  const toggle = $('#theme-toggle') as HTMLElement | null;

  // Circular reveal expanding from the toggle button.
  if (
    !prefersReducedMotion() &&
    !viewTransitionBusy &&
    typeof doc.startViewTransition === 'function' &&
    toggle
  ) {
    const rect = toggle.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    viewTransitionBusy = true;
    try {
      const transition = doc.startViewTransition(apply);
      transition.finished.finally(() => {
        viewTransitionBusy = false;
      });
      transition.ready
        .then(() => {
          html.animate(
            {
              clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
            },
            {
              duration: 420,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        })
        .catch(() => {
          /* animation interrupted — theme already applied */
        });
      return;
    } catch {
      // Fall through to the cross-fade if a transition is already running.
      viewTransitionBusy = false;
    }
  }

  // A reveal is already in flight — apply instantly so rapid clicks stay
  // responsive instead of being swallowed by the locked snapshot.
  if (viewTransitionBusy) {
    apply();
    return;
  }

  crossFadeTheme(apply);
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
      crossFadeTheme(() => applyTheme(e.matches ? 'dark' : 'light'));
    }
  });
}

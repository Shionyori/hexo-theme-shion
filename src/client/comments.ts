/**
 * Comment systems — lazy-loads the configured provider, keeps it in sync with
 * the site theme, and rebuilds it after every PJAX navigation.
 *
 * Provider templates in `layout/_partial/comments/` are pure mount points; all
 * runtime behaviour lives here so that `initContent()` can re-run it when
 * `pjax.ts` replaces `#pjax-container`.
 *
 * Static configuration is injected once via `window.__shionConfig.comments`
 * (head), while per-page values (URL, identifier, language) are read from the
 * `data-*` attributes of the `.comments` section so they travel with PJAX.
 */

// ── Types ───────────────────────────────────────────────────

interface GiscusConfig {
  repo?: string;
  repo_id?: string;
  category?: string;
  category_id?: string;
  mapping?: string;
  strict?: boolean | string;
  reactions_enabled?: boolean | string;
  emit_metadata?: boolean | string;
  input_position?: string;
  lang?: string;
}

interface DisqusConfig {
  shortname?: string;
}

interface WalineConfig {
  serverURL?: string;
  lang?: string;
  path?: string;
  locale?: Record<string, unknown>;
  [key: string]: unknown;
}

interface TwikooConfig {
  envId?: string;
  lang?: string;
  region?: string;
  path?: string;
  [key: string]: unknown;
}

interface ValineConfig {
  appId?: string;
  appKey?: string;
  lang?: string;
  path?: string;
  placeholder?: string;
  [key: string]: unknown;
}

interface GitalkConfig {
  clientID?: string;
  clientSecret?: string;
  repo?: string;
  owner?: string;
  admin?: string[];
  id?: string;
  distractionFreeMode?: boolean;
  [key: string]: unknown;
}

interface UtterancesConfig {
  repo?: string;
  issue_term?: string;
  label?: string;
  [key: string]: unknown;
}

interface CommentsConfig {
  enable?: boolean;
  type?: string;
  lazy?: boolean;
  placeholder?: string;
  giscus?: GiscusConfig;
  disqus?: DisqusConfig;
  waline?: WalineConfig;
  twikoo?: TwikooConfig;
  valine?: ValineConfig;
  gitalk?: GitalkConfig;
  utterances?: UtterancesConfig;
}

interface PageData {
  url: string;
  identifier: string;
  lang: string;
}

interface Destroyable {
  destroy?: () => void;
}

interface DisqusGlobal {
  reset(options: { reload: boolean; config: () => void }): void;
}

declare global {
  interface Window {
    __shionConfig?: {
      comments?: CommentsConfig;
      [key: string]: unknown;
    };
    disqus_config?: () => void;
    DISQUS?: DisqusGlobal;
    Waline?: { init(options: Record<string, unknown>): Destroyable };
    twikoo?: { init(options: Record<string, unknown>): unknown };
    Valine?: new (options: Record<string, unknown>) => Destroyable;
    Gitalk?: new (options: Record<string, unknown>) => {
      render(container: string | HTMLElement): void;
    };
  }
}

// ── Constants ───────────────────────────────────────────────

const GISCUS_SRC = 'https://giscus.app/client.js';
const UTTERANCES_SRC = 'https://utteranc.es/client.js';
const UTTERANCES_ORIGIN = 'https://utteranc.es';
const GISCUS_ORIGIN = 'https://giscus.app';

const WALINE_JS = 'https://cdn.jsdelivr.net/npm/@waline/client@3/dist/waline.js';
const WALINE_CSS = 'https://cdn.jsdelivr.net/npm/@waline/client@3/dist/waline.css';
const TWIKOO_JS = 'https://cdn.jsdelivr.net/npm/twikoo@1/dist/twikoo.all.min.js';
const VALINE_JS = 'https://cdn.jsdelivr.net/npm/valine@1/dist/Valine.min.js';
const GITALK_JS = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js';
const GITALK_CSS = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css';

const PROVIDERS = [
  'giscus',
  'disqus',
  'waline',
  'twikoo',
  'valine',
  'gitalk',
  'utterances',
] as const;

type Provider = (typeof PROVIDERS)[number];

// ── Module state ────────────────────────────────────────────

// Incremented on every init so in-flight async providers from a previous page
// can bail out instead of mutating detached DOM.
let generation = 0;
let observer: IntersectionObserver | null = null;
let globalListenersBound = false;
let walineInstance: Destroyable | null = null;
let valineInstance: Destroyable | null = null;

// One promise per external library, shared across PJAX navigations.
const scriptCache = new Map<string, Promise<void>>();
const styleCache = new Map<string, Promise<void>>();

// ── Small helpers ───────────────────────────────────────────

function text(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim();
}

/** Normalise a YAML boolean / string into the '0' | '1' flags giscus expects. */
function flag(value: unknown, fallback: '0' | '1'): '0' | '1' {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value ? '1' : '0';
  const normalised = String(value).toLowerCase();
  return normalised === '1' || normalised === 'true' || normalised === 'yes' ? '1' : '0';
}

function currentTheme(): 'dark' | 'light' {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Map the site language to the locale codes used by Waline / Twikoo / Valine. */
function resolveLang(value: unknown, pageLang: string): string {
  const configured = text(value);
  const lang = configured && configured !== 'auto' ? configured : pageLang;
  const lower = lang.toLowerCase();

  if (lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower.startsWith('zh-hant')) {
    return 'zh-TW';
  }
  if (lower.startsWith('zh')) return 'zh-CN';
  if (lower.startsWith('ja')) return 'ja';
  if (lower.startsWith('ko')) return 'ko';
  if (lower.startsWith('ru')) return 'ru';
  return 'en';
}

function warn(missing: string): void {
  console.warn(`[shion] Comments are enabled but \`${missing}\` is not configured.`);
}

function safeDestroy(instance: Destroyable | null): void {
  try {
    instance?.destroy?.();
  } catch {
    /* provider cleanup is best-effort */
  }
}

function mountOf(root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>('[data-comments-mount]') || root;
}

function readPageData(root: HTMLElement): PageData {
  return {
    url: root.dataset.pageUrl || window.location.href,
    identifier: root.dataset.pageIdentifier || window.location.pathname,
    lang: root.dataset.lang || document.documentElement.lang || 'en',
  };
}

// ── External asset loading ──────────────────────────────────

function loadScriptOnce(src: string): Promise<void> {
  const cached = scriptCache.get(src);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-shion-lib="${src}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.shionLib = src;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), {
      once: true,
    });
    document.head.appendChild(script);
  });

  // Drop failed loads from the cache so a later navigation can retry.
  promise.catch(() => scriptCache.delete(src));
  scriptCache.set(src, promise);
  return promise;
}

function loadStyleOnce(href: string): Promise<void> {
  const cached = styleCache.get(href);
  if (cached) return cached;

  const promise = new Promise<void>((resolve) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[data-shion-style="${href}"]`);
    if (existing) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset.shionStyle = href;
    link.addEventListener('load', () => resolve(), { once: true });
    // Treat a failed stylesheet as non-fatal — the widget still works unstyled.
    link.addEventListener('error', () => resolve(), { once: true });
    document.head.appendChild(link);
  });

  styleCache.set(href, promise);
  return promise;
}

/** Append a per-mount embed script (giscus / utterances) and return it. */
function appendEmbed(
  mount: HTMLElement,
  src: string,
  attributes: Record<string, string>,
): HTMLScriptElement {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.crossOrigin = 'anonymous';
  Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
  mount.appendChild(script);
  return script;
}

// ── Providers ───────────────────────────────────────────────

function initGiscus(root: HTMLElement, config: CommentsConfig): void {
  const giscus = config.giscus || {};
  if (!text(giscus.repo) || !text(giscus.repo_id) || !text(giscus.category_id)) {
    warn('comments.giscus.repo / repo_id / category_id');
    showSetup(root, 'generic');
    return;
  }

  appendEmbed(mountOf(root), GISCUS_SRC, {
    'data-repo': text(giscus.repo),
    'data-repo-id': text(giscus.repo_id),
    'data-category': text(giscus.category),
    'data-category-id': text(giscus.category_id),
    'data-mapping': text(giscus.mapping) || 'pathname',
    'data-strict': flag(giscus.strict, '0'),
    'data-reactions-enabled': flag(giscus.reactions_enabled, '1'),
    'data-emit-metadata': flag(giscus.emit_metadata, '0'),
    'data-input-position': text(giscus.input_position) || 'top',
    'data-theme': currentTheme(),
    'data-lang': text(giscus.lang) || 'auto',
    'data-loading': 'lazy',
  });
}

function initDisqus(root: HTMLElement, config: CommentsConfig, page: PageData): void {
  const shortname = text(config.disqus?.shortname);
  if (!shortname) {
    warn('comments.disqus.shortname');
    showSetup(root, 'generic');
    return;
  }
  if (!root.querySelector('#disqus_thread')) return;

  const disqusConfig = function (this: { page: { url: string; identifier: string } }): void {
    this.page.url = page.url;
    this.page.identifier = page.identifier;
  };

  window.disqus_config = disqusConfig;

  // Re-navigation: reuse the already-loaded embed and just reload the thread.
  if (window.DISQUS) {
    window.DISQUS.reset({ reload: true, config: disqusConfig as unknown as () => void });
    return;
  }

  const script = document.createElement('script');
  script.src = `https://${shortname}.disqus.com/embed.js`;
  script.async = true;
  script.setAttribute('data-timestamp', String(Date.now()));
  (document.head || document.body).appendChild(script);
}

function initUtterances(root: HTMLElement, config: CommentsConfig): void {
  const utterances = config.utterances || {};
  if (!text(utterances.repo)) {
    warn('comments.utterances.repo');
    showSetup(root, 'generic');
    return;
  }

  const attributes: Record<string, string> = {
    repo: text(utterances.repo),
    'issue-term': text(utterances.issue_term) || 'pathname',
    theme: currentTheme() === 'dark' ? 'github-dark' : 'github-light',
    crossorigin: 'anonymous',
  };
  if (text(utterances.label)) attributes.label = text(utterances.label);

  appendEmbed(mountOf(root), UTTERANCES_SRC, attributes);
}

async function initWaline(
  root: HTMLElement,
  config: CommentsConfig,
  page: PageData,
  isStale: () => boolean,
): Promise<void> {
  const waline = config.waline || {};
  const serverURL = text(waline.serverURL);
  if (!serverURL) {
    // The theme renders a setup notice in waline.ejs; show it instead of an empty box.
    showSetup(root, 'waline');
    return;
  }
  if (!root.querySelector('#waline')) return;

  await Promise.all([loadScriptOnce(WALINE_JS), loadStyleOnce(WALINE_CSS)]);
  if (isStale()) return;

  const Waline = window.Waline;
  if (!Waline) return;

  // Everything except the options the theme owns is forwarded verbatim, so any
  // Waline client option (meta, login, emoji, reaction, locale, ...) can be set
  // from _config.yml without touching this file.
  const { serverURL: _serverURL, lang, el: _el, dark: _dark, path, locale, ...options } = waline;

  const userLocale =
    locale && typeof locale === 'object' ? (locale as Record<string, unknown>) : {};
  // `comments.placeholder` is a theme-level shortcut; an explicit
  // `waline.locale.placeholder` always wins.
  const mergedLocale = config.placeholder
    ? { placeholder: config.placeholder, ...userLocale }
    : userLocale;

  safeDestroy(walineInstance);
  walineInstance = Waline.init({
    ...options,
    el: '#waline',
    serverURL,
    path: text(path) || window.location.pathname,
    lang: resolveLang(lang, page.lang),
    dark: 'html[data-theme="dark"]',
    ...(Object.keys(mergedLocale).length ? { locale: mergedLocale } : {}),
  });
}

async function initTwikoo(
  root: HTMLElement,
  config: CommentsConfig,
  page: PageData,
  isStale: () => boolean,
): Promise<void> {
  const twikoo = config.twikoo || {};
  const envId = text(twikoo.envId);
  if (!envId) {
    warn('comments.twikoo.envId');
    showSetup(root, 'generic');
    return;
  }
  const target = root.querySelector<HTMLElement>('#tcomment');
  if (!target) return;

  await loadScriptOnce(TWIKOO_JS);
  if (isStale()) return;

  const api = window.twikoo;
  if (!api) return;

  // Twikoo renders into the node it is given; clear any remnants first.
  target.innerHTML = '';

  // Pass provider-specific options through (region, path, ...); the theme
  // owns `el` and resolves `lang`.
  const { envId: _envId, lang, el: _el, path, ...options } = twikoo;
  api.init({
    ...options,
    envId,
    el: '#tcomment',
    lang: resolveLang(lang, page.lang),
    ...(text(path) ? { path: text(path) } : {}),
  });
}

async function initValine(
  root: HTMLElement,
  config: CommentsConfig,
  page: PageData,
  isStale: () => boolean,
): Promise<void> {
  const valine = config.valine || {};
  const appId = text(valine.appId);
  const appKey = text(valine.appKey);
  if (!appId || !appKey) {
    warn('comments.valine.appId / comments.valine.appKey');
    showSetup(root, 'generic');
    return;
  }
  const target = root.querySelector<HTMLElement>('#vcomments');
  if (!target) return;

  await loadScriptOnce(VALINE_JS);
  if (isStale()) return;

  const Valine = window.Valine;
  if (!Valine) return;

  safeDestroy(valineInstance);
  target.innerHTML = '';

  // Forward Valine options (meta, requiredFields, avatar, pageSize, ...);
  // the theme owns `el` and resolves `lang`.
  const { appId: _appId, appKey: _appKey, lang, el: _el, path, placeholder, ...options } = valine;

  valineInstance = new Valine({
    ...options,
    el: '#vcomments',
    appId,
    appKey,
    lang: resolveLang(lang, page.lang),
    placeholder: text(placeholder) || config.placeholder || 'Leave a comment',
    path: text(path) || window.location.pathname,
  });
}

async function initGitalk(
  root: HTMLElement,
  config: CommentsConfig,
  isStale: () => boolean,
): Promise<void> {
  const gitalk = config.gitalk || {};
  if (
    !text(gitalk.clientID) ||
    !text(gitalk.clientSecret) ||
    !text(gitalk.repo) ||
    !text(gitalk.owner)
  ) {
    warn('comments.gitalk.clientID / clientSecret / repo / owner');
    showSetup(root, 'generic');
    return;
  }
  const target = root.querySelector<HTMLElement>('#gitalk');
  if (!target) return;

  await Promise.all([loadScriptOnce(GITALK_JS), loadStyleOnce(GITALK_CSS)]);
  if (isStale()) return;

  const Gitalk = window.Gitalk;
  if (!Gitalk) return;

  target.innerHTML = '';

  // Forward Gitalk options (proxy, title, body, language, ...); the theme
  // derives `id` from the current path unless explicitly overridden.
  const { clientID, clientSecret, repo, owner, admin, id, distractionFreeMode, ...options } =
    gitalk;

  new Gitalk({
    ...options,
    clientID: text(clientID),
    clientSecret: text(clientSecret),
    repo: text(repo),
    owner: text(owner),
    admin: Array.isArray(admin) ? admin : [],
    id: decodeURI(text(id) || window.location.pathname),
    distractionFreeMode: typeof distractionFreeMode === 'boolean' ? distractionFreeMode : false,
  }).render('#gitalk');
}

// ── Theme synchronisation ───────────────────────────────────

/** Apply the current theme to providers that support live theme switching. */
function syncProviderTheme(mode: 'dark' | 'light'): void {
  const root = document.querySelector<HTMLElement>('.comments[data-comment-type]');
  if (!root) return;

  const type = root.dataset.commentType;

  if (type === 'giscus') {
    const iframe = root.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage({ giscus: { setConfig: { theme: mode } } }, GISCUS_ORIGIN);
    return;
  }

  if (type === 'utterances') {
    const iframe = root.querySelector<HTMLIFrameElement>('iframe');
    iframe?.contentWindow?.postMessage(
      { type: 'set-theme', theme: mode === 'dark' ? 'github-dark' : 'github-light' },
      UTTERANCES_ORIGIN,
    );
  }

  // Waline watches `html[data-theme="dark"]` via its `dark` option.
  // Gitalk / Valine / Twikoo / Disqus are themed by CSS (see _comments.scss).
}

/**
 * Swap the provider mount for the themed setup notice rendered by the
 * provider template (missing server URL / missing giscus GitHub App).
 */
type SetupKind = 'generic' | 'giscus' | 'waline';

function showSetup(root: HTMLElement, kind: SetupKind = 'generic'): void {
  const notice =
    root.querySelector<HTMLElement>(`[data-comments-setup="${kind}"]`) ||
    root.querySelector<HTMLElement>('[data-comments-setup]');
  if (!notice) return;

  root.classList.add('is-unconfigured');
  notice.hidden = false;
}

function showSetupFor(type: 'giscus'): void {
  const root = document.querySelector<HTMLElement>(`.comments[data-comment-type="${type}"]`);
  if (root) showSetup(root, type);
}

/** Show the themed retry card when a provider script or init fails. */
function showError(root: HTMLElement): void {
  if (root.classList.contains('is-unconfigured')) return;

  const notice = root.querySelector<HTMLElement>('[data-comments-error]');
  if (!notice) return;

  root.classList.add('has-error');
  notice.hidden = false;
}

/** Retry simply reloads the page — providers rebuild themselves on load. */
function bindRetryButton(root: HTMLElement): void {
  const button = root.querySelector<HTMLElement>('[data-comments-retry]');
  if (!button || button.dataset.commentsRetryBound === 'true') return;
  button.dataset.commentsRetryBound = 'true';

  button.addEventListener('click', () => window.location.reload());
}

function bindGlobalListeners(): void {
  if (globalListenersBound) return;
  globalListenersBound = true;

  document.addEventListener('themeChanged', (event) => {
    const detail = (event as CustomEvent<string>).detail;
    syncProviderTheme(detail === 'dark' ? 'dark' : 'light');
  });

  window.addEventListener('message', (event) => {
    if (event.origin !== GISCUS_ORIGIN) return;

    const data = event.data as { giscus?: { error?: unknown } } | null;
    const error = data?.giscus?.error;
    if (typeof error === 'string' && /not installed/i.test(error)) {
      showSetupFor('giscus');
    }
  });
}

// ── Boot / teardown ─────────────────────────────────────────

async function startProvider(
  root: HTMLElement,
  type: Provider,
  config: CommentsConfig,
  page: PageData,
  isStale: () => boolean,
): Promise<void> {
  try {
    switch (type) {
      case 'giscus':
        initGiscus(root, config);
        break;
      case 'disqus':
        initDisqus(root, config, page);
        break;
      case 'utterances':
        initUtterances(root, config);
        break;
      case 'waline':
        await initWaline(root, config, page, isStale);
        break;
      case 'twikoo':
        await initTwikoo(root, config, page, isStale);
        break;
      case 'valine':
        await initValine(root, config, page, isStale);
        break;
      case 'gitalk':
        await initGitalk(root, config, isStale);
        break;
    }
  } catch (error) {
    console.warn('[shion] Failed to initialize comments:', error);
    if (!isStale()) showError(root);
  } finally {
    if (!isStale()) {
      root.querySelector('.comments-loading')?.remove();
      root.classList.add('is-ready');
    }
  }
}

/**
 * Initialise (or re-initialise, after PJAX) the comment section.
 * Safe to call on every navigation — does nothing when no section exists.
 */
export function initComments(): void {
  // A navigation happened: stop observing the old section and invalidate any
  // provider that is still awaiting its CDN script.
  observer?.disconnect();
  observer = null;
  const token = ++generation;
  const isStale = (): boolean => token !== generation;

  const config = window.__shionConfig?.comments;
  const root = document.querySelector<HTMLElement>('.comments[data-comment-type]');
  if (!root || !config) return;

  const type = (root.dataset.commentType || '').toLowerCase() as Provider;
  if (!PROVIDERS.includes(type)) return;
  if (root.dataset.commentsInitialised === 'true') return;

  bindGlobalListeners();
  bindRetryButton(root);

  const page = readPageData(root);
  const start = (): void => {
    if (isStale()) return;
    root.dataset.commentsInitialised = 'true';
    void startProvider(root, type, config, page, isStale);
  };

  if (config.lazy === false || !('IntersectionObserver' in window)) {
    start();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer?.disconnect();
      observer = null;
      start();
    },
    { threshold: 0.1, rootMargin: '0px 0px 120px 0px' },
  );
  observer.observe(root);
}

/**
 * Music player — HTML5 Audio with playlist panel, play modes, and persistence.
 * Audio instance lives on window.__musicState so playback survives PJAX navigation.
 */

interface Track {
  name: string;
  artist: string;
  url: string;
  cover: string;
}

type PlayMode = 'sequential' | 'loop-all' | 'loop-one' | 'shuffle';

interface MusicState {
  audio: HTMLAudioElement;
  playlist: Track[];
  currentIndex: number;
  isPlaying: boolean;
  playMode: PlayMode;
  initialized: boolean;
  durationKnown: boolean;
  // Stored event handler references — removed and rebound after PJAX DOM swap
  _timeUpdate?: () => void;
  _metaLoaded?: () => void;
  _durChange?: () => void;
  _ended?: () => void;
  _error?: () => void;
  _docClick?: (e: Event) => void;
  _keyDown?: (e: KeyboardEvent) => void;
}

const STORAGE_KEY = 'shion-music';
const MODE_ICONS: Record<PlayMode, string> = {
  sequential: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  'loop-all':
    '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  'loop-one':
    '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/><text x="12" y="16" text-anchor="middle" font-size="8" font-weight="700">1</text>',
  shuffle:
    '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
};

const MODE_ORDER: PlayMode[] = ['sequential', 'loop-all', 'loop-one', 'shuffle'];

function getOrCreateState(): MusicState {
  const win = window as any;
  if (win.__musicState) return win.__musicState;

  const state: MusicState = {
    audio: new Audio(),
    playlist: [],
    currentIndex: 0,
    isPlaying: false,
    playMode: 'sequential',
    initialized: false,
    durationKnown: false,
  };

  // Restore persisted settings
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (typeof saved.mode === 'string' && MODE_ORDER.includes(saved.mode)) {
      state.playMode = saved.mode;
    }
    if (typeof saved.volume === 'number') {
      state.audio.volume = Math.max(0, Math.min(1, saved.volume));
    }
  } catch {
    /* ignore */
  }

  win.__musicState = state;
  return state;
}

function persist(state: MusicState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        index: state.currentIndex,
        mode: state.playMode,
        volume: state.audio.volume,
        time: state.audio.currentTime,
      }),
    );
  } catch {
    /* ignore */
  }
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function initMusicPlayer(): void {
  const el = document.querySelector<HTMLElement>('.music-player');
  if (!el || el.classList.contains('is-empty')) return;

  const state = getOrCreateState();

  // Update playlist from current page's data attribute
  let newPlaylist: Track[];
  try {
    newPlaylist = JSON.parse(el.dataset.playlist || '[]');
  } catch {
    return;
  }
  if (!newPlaylist.length) return;

  // If playlist changed, update and clamp index
  state.playlist = newPlaylist;
  if (state.currentIndex >= newPlaylist.length) {
    state.currentIndex = 0;
  }

  // Restore saved index if we're on initial load (not yet initialized)
  if (!state.initialized) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (typeof saved.index === 'number' && saved.index < state.playlist.length) {
        state.currentIndex = saved.index;
      }
      if (typeof saved.time === 'number' && saved.time > 0) {
        state.audio.currentTime = saved.time;
      }
    } catch {
      /* ignore */
    }
  }

  // Persist timer
  let persistTimer: ReturnType<typeof setInterval>;
  if (!state.initialized) {
    state.audio.addEventListener('play', () => {
      persistTimer = setInterval(() => persist(state), 2000);
    });
    state.audio.addEventListener('pause', () => {
      clearInterval(persistTimer);
      persist(state);
    });
  }

  // ── DOM refs (always re-queried) ──────────────────────────

  const coverImg = el.querySelector<HTMLImageElement>('.music-cover-img');
  const titleEl = el.querySelector<HTMLElement>('.music-title');
  const artistEl = el.querySelector<HTMLElement>('.music-artist');
  const counterEl = el.querySelector<HTMLElement>('.music-counter');
  const progressFill = el.querySelector<HTMLElement>('.music-progress-fill');
  const timeCurrent = el.querySelector<HTMLElement>('.music-time-current');
  const timeTotal = el.querySelector<HTMLElement>('.music-time-total');
  const btnPlay = el.querySelector<HTMLElement>('.music-btn-play');
  const btnPrev = el.querySelector<HTMLElement>('.music-btn-prev');
  const btnNext = el.querySelector<HTMLElement>('.music-btn-next');
  const btnMode = el.querySelector<HTMLElement>('.music-btn-mode');
  const btnList = el.querySelector<HTMLElement>('.music-btn-list');
  const progressBar = el.querySelector<HTMLElement>('.music-progress-bar');
  const playlistPanel = el.querySelector<HTMLElement>('.music-playlist');

  // ── UI helpers ────────────────────────────────────────────

  function updateCounter(): void {
    if (counterEl) counterEl.textContent = `${state.currentIndex + 1} / ${state.playlist.length}`;
  }

  function updateModeButton(): void {
    if (!btnMode) return;
    btnMode.dataset.mode = state.playMode;
    btnMode.title =
      state.playMode === 'sequential'
        ? 'Sequential'
        : state.playMode === 'loop-all'
          ? 'Loop All'
          : state.playMode === 'loop-one'
            ? 'Loop One'
            : 'Shuffle';
    const svg = btnMode.querySelector('.music-mode-icon');
    if (svg) {
      svg.innerHTML = MODE_ICONS[state.playMode];
    }
  }

  function renderTrack(): void {
    const track = state.playlist[state.currentIndex];
    if (!track) return;

    if (titleEl) {
      titleEl.textContent = track.name;
      titleEl.classList.remove('is-overflow');
      requestAnimationFrame(() => {
        if (titleEl && titleEl.scrollWidth > titleEl.clientWidth) {
          titleEl.classList.add('is-overflow');
        }
      });
    }
    if (artistEl) artistEl.textContent = track.artist;
    updateCounter();

    if (coverImg && track.cover) {
      coverImg.removeAttribute('data-failed');
      coverImg.src = track.cover;
      coverImg.style.display = '';
    } else if (coverImg) {
      coverImg.style.display = 'none';
    }

    state.durationKnown = false;
    el?.classList.remove('has-duration');
    if (timeTotal) timeTotal.textContent = '0:00';
    if (timeCurrent) timeCurrent.textContent = '0:00';
    if (progressFill) progressFill.style.width = '0%';

    playlistPanel?.querySelectorAll('.music-playlist-item').forEach((item) => {
      const idx = (item as HTMLElement).dataset.index;
      item.classList.toggle('active', idx === String(state.currentIndex));
    });
  }

  // ── Playback ──────────────────────────────────────────────

  function loadAndPlay(): void {
    const track = state.playlist[state.currentIndex];
    if (!track) return;
    el?.classList.add('is-loading');
    state.audio.src = track.url;
    state.audio.load();
    state.audio
      .play()
      .then(() => {
        state.isPlaying = true;
        el?.classList.add('is-playing');
        el?.classList.remove('is-loading');
      })
      .catch(() => {
        el?.classList.remove('is-loading');
      });
  }

  function play(): void {
    if (!state.audio.src) {
      loadAndPlay();
      return;
    }
    state.audio
      .play()
      .then(() => {
        state.isPlaying = true;
        el?.classList.add('is-playing');
      })
      .catch(() => {});
  }

  function pause(): void {
    state.audio.pause();
    state.isPlaying = false;
    el?.classList.remove('is-playing');
  }

  function togglePlay(): void {
    if (state.isPlaying) pause();
    else play();
  }

  function jumpTo(index: number): void {
    if (index === state.currentIndex) return;
    state.currentIndex = index;
    renderTrack();
    loadAndPlay();
    persist(state);
  }

  function next(): void {
    if (state.playMode === 'shuffle') {
      if (state.playlist.length <= 1) {
        state.currentIndex = 0;
      } else {
        let nextIdx: number;
        do {
          nextIdx = Math.floor(Math.random() * state.playlist.length);
        } while (nextIdx === state.currentIndex);
        state.currentIndex = nextIdx;
      }
    } else {
      state.currentIndex = (state.currentIndex + 1) % state.playlist.length;
    }
    renderTrack();
    if (state.isPlaying) {
      pause();
      loadAndPlay();
    }
    persist(state);
  }

  function prev(): void {
    state.currentIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
    renderTrack();
    if (state.isPlaying) {
      pause();
      loadAndPlay();
    }
    persist(state);
  }

  function cycleMode(): void {
    const idx = MODE_ORDER.indexOf(state.playMode);
    state.playMode = MODE_ORDER[(idx + 1) % MODE_ORDER.length];
    updateModeButton();
    persist(state);
  }

  // ── Playlist panel ────────────────────────────────────────

  function togglePlaylist(): void {
    el?.classList.toggle('is-playlist-open');
  }

  function closePlaylist(): void {
    el?.classList.remove('is-playlist-open');
  }

  // ── Progress ──────────────────────────────────────────────

  function hasDuration(): boolean {
    return isFinite(state.audio.duration) && state.audio.duration > 0;
  }

  function updateProgress(): void {
    if (timeCurrent) timeCurrent.textContent = formatTime(state.audio.currentTime);

    if (hasDuration()) {
      if (!state.durationKnown) {
        state.durationKnown = true;
        el?.classList.add('has-duration');
        updateTotalTime();
      }
      const pct = (state.audio.currentTime / state.audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
    }
  }

  function updateTotalTime(): void {
    if (hasDuration() && timeTotal) {
      timeTotal.textContent = formatTime(state.audio.duration);
    }
  }

  function setProgress(e: MouseEvent): void {
    if (!hasDuration() || !progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    state.audio.currentTime = Math.max(0, Math.min(pct, 1)) * state.audio.duration;
  }

  // ── Event binding ─────────────────────────────────────────

  // DOM events: rebind every time (elements are new after PJAX)
  btnPlay?.addEventListener('click', togglePlay);
  btnPrev?.addEventListener('click', prev);
  btnNext?.addEventListener('click', next);
  btnMode?.addEventListener('click', cycleMode);
  btnList?.addEventListener('click', togglePlaylist);
  progressBar?.addEventListener('click', setProgress);

  playlistPanel?.addEventListener('click', (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('.music-playlist-item');
    if (!item) return;
    const idx = Number(item.dataset.index);
    if (!isNaN(idx)) {
      jumpTo(idx);
      closePlaylist();
    }
  });

  // Audio + document events: always rebind (DOM refs change after PJAX navigation).
  // Remove old handlers first so stale closures don't update detached DOM elements.
  if (state._timeUpdate) {
    state.audio.removeEventListener('timeupdate', state._timeUpdate);
    state.audio.removeEventListener('loadedmetadata', state._metaLoaded!);
    state.audio.removeEventListener('durationchange', state._durChange!);
    state.audio.removeEventListener('ended', state._ended!);
    state.audio.removeEventListener('error', state._error!);
    document.removeEventListener('click', state._docClick!);
    document.removeEventListener('keydown', state._keyDown!);
  }

  // Create handler closures with current DOM refs
  const endedHandler = () => {
    if (state.playMode === 'loop-one') {
      state.audio.currentTime = 0;
      state.audio.play().catch(() => {});
    } else if (state.playMode === 'loop-all' || state.playMode === 'shuffle') {
      next();
    } else {
      if (state.currentIndex >= state.playlist.length - 1) {
        pause();
      } else {
        next();
      }
    }
  };

  const errorHandler = () => {
    next();
  };

  const docClickHandler = (e: Event) => {
    if (el?.classList.contains('is-playlist-open') && !el.contains(e.target as Node)) {
      closePlaylist();
    }
  };

  const keydownHandler = (e: KeyboardEvent) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement).isContentEditable
    )
      return;

    if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      prev();
    }
  };

  // Store references so they can be removed on the next init call
  state._timeUpdate = updateProgress;
  state._metaLoaded = updateTotalTime;
  state._durChange = updateTotalTime;
  state._ended = endedHandler;
  state._error = errorHandler;
  state._docClick = docClickHandler;
  state._keyDown = keydownHandler;

  // Bind fresh handlers
  state.audio.addEventListener('timeupdate', updateProgress);
  state.audio.addEventListener('loadedmetadata', updateTotalTime);
  state.audio.addEventListener('durationchange', updateTotalTime);
  state.audio.addEventListener('ended', endedHandler);
  state.audio.addEventListener('error', errorHandler);
  document.addEventListener('click', docClickHandler);
  document.addEventListener('keydown', keydownHandler);

  if (!state.initialized) {
    state.initialized = true;
  }

  // ── Init UI ───────────────────────────────────────────────

  updateModeButton();
  renderTrack();

  // Reflect current playback state in UI
  if (state.isPlaying) {
    el?.classList.add('is-playing');
    updateProgress();
    updateTotalTime();
  }
}

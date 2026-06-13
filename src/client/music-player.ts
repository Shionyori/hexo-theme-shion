/**
 * Music player — HTML5 Audio with playlist panel, play modes, and persistence.
 */

interface Track {
  name: string;
  artist: string;
  url: string;
  cover: string;
}

type PlayMode = 'sequential' | 'loop-all' | 'loop-one' | 'shuffle';

const STORAGE_KEY = 'shion-music';
const MODE_ICONS: Record<PlayMode, string> = {
  sequential:
    '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  'loop-all':
    '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  'loop-one':
    '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/><text x="12" y="16" text-anchor="middle" font-size="8" font-weight="700">1</text>',
  shuffle:
    '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
};

const MODE_ORDER: PlayMode[] = ['sequential', 'loop-all', 'loop-one', 'shuffle'];

export function initMusicPlayer(): void {
  const el = document.querySelector<HTMLElement>('.music-player');
  if (!el || el.classList.contains('is-empty')) return;

  let playlist: Track[];
  try {
    playlist = JSON.parse(el.dataset.playlist || '[]');
  } catch {
    return;
  }
  if (!playlist.length) return;

  // ── State ─────────────────────────────────────────────

  let currentIndex = 0;
  let isPlaying = false;
  let playMode: PlayMode = 'sequential';
  const audio = new Audio();

  // restore persisted state
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (typeof saved.index === 'number' && saved.index < playlist.length) {
      currentIndex = saved.index;
    }
    if (saved.mode && MODE_ORDER.includes(saved.mode)) {
      playMode = saved.mode;
    }
    if (typeof saved.volume === 'number') {
      audio.volume = Math.max(0, Math.min(1, saved.volume));
    }
    if (typeof saved.time === 'number' && saved.time > 0) {
      audio.currentTime = saved.time;
    }
  } catch { /* ignore */ }

  function persist(): void {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          index: currentIndex,
          mode: playMode,
          volume: audio.volume,
          time: audio.currentTime,
        }),
      );
    } catch { /* ignore */ }
  }

  // save state periodically
  let persistTimer: ReturnType<typeof setInterval>;
  audio.addEventListener('play', () => {
    persistTimer = setInterval(persist, 2000);
  });
  audio.addEventListener('pause', () => {
    clearInterval(persistTimer);
    persist();
  });

  // ── DOM refs ──────────────────────────────────────────

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

  // ── Helpers ───────────────────────────────────────────

  function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function updateCounter(): void {
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${playlist.length}`;
  }

  function updateModeButton(): void {
    if (!btnMode) return;
    btnMode.dataset.mode = playMode;
    btnMode.title =
      playMode === 'sequential'
        ? 'Sequential'
        : playMode === 'loop-all'
          ? 'Loop All'
          : playMode === 'loop-one'
            ? 'Loop One'
            : 'Shuffle';
    const svg = btnMode.querySelector('.music-mode-icon');
    if (svg) {
      svg.innerHTML = MODE_ICONS[playMode];
    }
  }

  function renderTrack(): void {
    const track = playlist[currentIndex];
    if (!track) return;

    if (titleEl) {
      titleEl.textContent = track.name;
      // detect overflow for marquee
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

    durationKnown = false;
    el?.classList.remove('has-duration');
    if (timeTotal) timeTotal.textContent = '0:00';
    if (timeCurrent) timeCurrent.textContent = '0:00';
    if (progressFill) progressFill.style.width = '0%';

    // highlight active playlist item
    playlistPanel?.querySelectorAll('.music-playlist-item').forEach((item) => {
      const idx = (item as HTMLElement).dataset.index;
      item.classList.toggle('active', idx === String(currentIndex));
    });
  }

  // ── Playback ──────────────────────────────────────────

  function loadAndPlay(): void {
    const track = playlist[currentIndex];
    if (!track) return;
    el?.classList.add('is-loading');
    audio.src = track.url;
    audio.load();
    audio.play().then(() => {
      isPlaying = true;
      el?.classList.add('is-playing');
      el?.classList.remove('is-loading');
    }).catch(() => {
      el?.classList.remove('is-loading');
    });
  }

  function play(): void {
    if (!audio.src) {
      loadAndPlay();
      return;
    }
    audio.play().then(() => {
      isPlaying = true;
      el?.classList.add('is-playing');
    }).catch(() => {});
  }

  function pause(): void {
    audio.pause();
    isPlaying = false;
    el?.classList.remove('is-playing');
  }

  function togglePlay(): void {
    if (isPlaying) pause();
    else play();
  }

  function jumpTo(index: number): void {
    if (index === currentIndex) return;
    currentIndex = index;
    renderTrack();
    loadAndPlay();
    persist();
  }

  function next(): void {
    if (playMode === 'shuffle') {
      if (playlist.length <= 1) {
        currentIndex = 0;
      } else {
        let nextIdx: number;
        do {
          nextIdx = Math.floor(Math.random() * playlist.length);
        } while (nextIdx === currentIndex);
        currentIndex = nextIdx;
      }
    } else {
      currentIndex = (currentIndex + 1) % playlist.length;
    }
    renderTrack();
    if (isPlaying) {
      pause();
      loadAndPlay();
    }
    persist();
  }

  function prev(): void {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    renderTrack();
    if (isPlaying) {
      pause();
      loadAndPlay();
    }
    persist();
  }

  function cycleMode(): void {
    const idx = MODE_ORDER.indexOf(playMode);
    playMode = MODE_ORDER[(idx + 1) % MODE_ORDER.length];
    updateModeButton();
    persist();
  }

  // ── Playlist panel ────────────────────────────────────

  function togglePlaylist(): void {
    el?.classList.toggle('is-playlist-open');
  }

  function closePlaylist(): void {
    el?.classList.remove('is-playlist-open');
  }

  // ── Progress ──────────────────────────────────────────

  function hasDuration(): boolean {
    return isFinite(audio.duration) && audio.duration > 0;
  }

  let durationKnown = false;

  function updateProgress(): void {
    if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);

    if (hasDuration()) {
      if (!durationKnown) {
        durationKnown = true;
        el?.classList.add('has-duration');
        updateTotalTime();
      }
      const pct = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${pct}%`;
    }
  }

  function updateTotalTime(): void {
    if (hasDuration() && timeTotal) {
      timeTotal.textContent = formatTime(audio.duration);
    }
  }

  function setProgress(e: MouseEvent): void {
    if (!hasDuration() || !progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(0, Math.min(pct, 1)) * audio.duration;
  }

  // ── Events ────────────────────────────────────────────

  btnPlay?.addEventListener('click', togglePlay);
  btnPrev?.addEventListener('click', prev);
  btnNext?.addEventListener('click', next);
  btnMode?.addEventListener('click', cycleMode);
  btnList?.addEventListener('click', togglePlaylist);
  progressBar?.addEventListener('click', setProgress);

  // playlist item clicks
  playlistPanel?.addEventListener('click', (e) => {
    const item = (e.target as HTMLElement).closest<HTMLElement>('.music-playlist-item');
    if (!item) return;
    const idx = Number(item.dataset.index);
    if (!isNaN(idx)) {
      jumpTo(idx);
      closePlaylist();
    }
  });

  // close playlist on outside click
  document.addEventListener('click', (e) => {
    if (el?.classList.contains('is-playlist-open') && !el.contains(e.target as Node)) {
      closePlaylist();
    }
  });

  // keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // ignore when typing in inputs
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      (e.target as HTMLElement).isContentEditable
    )
      return;

    if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // space toggles play/pause
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowRight' && e.ctrlKey) {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
      e.preventDefault();
      prev();
    }
  });

  audio.addEventListener('timeupdate', updateProgress);

  function updateTotalTime(): void {
    if (hasDuration() && timeTotal) {
      timeTotal.textContent = formatTime(audio.duration);
    }
  }
  audio.addEventListener('loadedmetadata', updateTotalTime);
  audio.addEventListener('durationchange', updateTotalTime);

  audio.addEventListener('ended', () => {
    if (playMode === 'loop-one') {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else if (playMode === 'loop-all' || playMode === 'shuffle') {
      next();
    } else {
      // sequential: stop at last track
      if (currentIndex >= playlist.length - 1) {
        pause();
      } else {
        next();
      }
    }
  });
  audio.addEventListener('error', () => {
    next();
  });

  // ── Init ──────────────────────────────────────────────

  updateModeButton();
  renderTrack();
  // restore playback position
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (typeof saved.time === 'number' && saved.time > 0) {
      audio.currentTime = 0; // can't seek without src loaded
    }
  } catch { /* ignore */ }
}

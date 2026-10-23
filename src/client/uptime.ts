/**
 * Site uptime counter.
 *
 * The footer renders "running for …" server-side, so the value is meaningful
 * without JS; this module keeps it ticking. How much detail it shows and how
 * often it updates come from the theme config (`runtime.precision` /
 * `runtime.refresh`) via data attributes — the client has no access to Hexo i18n.
 *
 * Without `refresh`, the next tick is scheduled exactly on the boundary of the
 * smallest displayed unit, so "3 天 4 小时" flips the hour the moment it changes
 * instead of up to 60 s late (or ticking ~86 400 times a day for nothing).
 */
const UNIT_MS = [86400000, 3600000, 60000, 1000];

let timer: number | null = null;

function clearTimer(): void {
  if (timer === null) return;
  window.clearTimeout(timer);
  timer = null;
}

function parts(totalSeconds: number): number[] {
  return [
    Math.floor(totalSeconds / 86400),
    Math.floor(totalSeconds / 3600) % 24,
    Math.floor(totalSeconds / 60) % 60,
    totalSeconds % 60,
  ];
}

/** Delay until the smallest displayed unit changes (aligned, not interval-based). */
function boundaryDelay(since: number, slots: number): number {
  const unit = UNIT_MS[Math.min(Math.max(slots, 1), UNIT_MS.length) - 1];
  const elapsed = Math.max(0, Date.now() - since);
  return unit - (elapsed % unit) + 20;
}

export function initUptime(): void {
  const root = document.querySelector<HTMLElement>('[data-uptime]');
  if (!root) return;

  clearTimer();

  const value = root.querySelector<HTMLElement>('[data-uptime-value]');
  const since = Date.parse(root.dataset.since || '');
  const format = root.dataset.uptimeFormat || '%s';
  const slots = format.match(/%s/g)?.length || 1;
  const refresh = Number(root.dataset.uptimeRefresh) || 0;

  if (!value || Number.isNaN(since)) return;

  const render = (): string => {
    const total = Math.max(0, Math.floor((Date.now() - since) / 1000));
    const values = parts(total);
    let i = 0;
    const text = format.replace(/%s/g, () => String(values[i++] ?? 0));
    value.textContent = text;
    return text;
  };

  const run = (): void => {
    render();
    const delay = refresh > 0 ? refresh * 1000 : boundaryDelay(since, slots);
    timer = window.setTimeout(run, delay);
  };

  run();
}

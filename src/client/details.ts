/**
 * Tag plugin details/summary — animates the {% details %} block open and closed.
 *
 * `<details>` has no transition of its own: content snaps in and out. The tag
 * plugin renders two wrappers we can drive with the Web Animations API:
 *
 *   .tag-details-body   the box — height 0 ↔ content-height (this is the clip)
 *   .tag-details-inner  the content — translateY, so the text slides into place
 *                       behind the summary instead of being wiped in from below
 *
 * Nothing is animated with inline styles that survive the gesture: the inline
 * height is cleared as soon as the animation settles, which keeps the block
 * responsive to content reflow (fonts, images, resizes).
 */

// easeOutQuad — immediately responsive, no violent start. The very front-loaded
// easeOutQuint this used to share with the link cards made the panel shoot open
// and then crawl for the last two thirds, which reads as stutter rather than
// smoothness. Collapsing is shorter: the reader already decided.
const OPEN = { duration: 280, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' };
const CLOSE = { duration: 220, easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' };
// How far the content travels. Small on purpose: it should read as settling,
// not as a panel flying in.
const SLIDE = 10;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Current translateY of an element, including any animation in flight. */
function currentShift(el: HTMLElement): number {
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === 'none') return 0;
  try {
    return new DOMMatrixReadOnly(transform).m42;
  } catch {
    return 0;
  }
}

function setupDetails(details: HTMLDetailsElement): void {
  if (details.dataset.detailsBound === 'true') return;

  const summary = details.querySelector<HTMLElement>(':scope > summary');
  const body = details.querySelector<HTMLElement>(':scope > .tag-details-body');
  // Without the wrapper there is nothing to animate — native behaviour is fine.
  if (!summary || !body) return;
  const inner = body.querySelector<HTMLElement>(':scope > .tag-details-inner');

  details.dataset.detailsBound = 'true';

  let running: Animation[] = [];
  // The state the reader last asked for. `details.open` flips immediately when
  // opening but only at the end when closing, so it cannot be used to decide
  // the next direction while an animation is in flight.
  let target = details.open;

  const settle = (open: boolean): void => {
    details.open = open;
    body.style.removeProperty('overflow');
    running = [];
  };

  const animate = (open: boolean): void => {
    target = open;

    // Measure BEFORE cancelling: `getBoundingClientRect()` / `getComputedStyle`
    // include the effect of a running animation, so an interrupted gesture
    // reverses from where the panel actually is. Cancelling first would snap the
    // height back to `auto` and the reversal would visibly jump.
    //
    // A *closed* <details> cannot be trusted to report 0: Chrome renders the
    // content box with `content-visibility: hidden` + `contain-intrinsic-size:
    // auto`, so it keeps the height it had the last time it was open. Reading it
    // made `from === to` and the expand animation collapse into an instant jump
    // (this is why only opening looked un-animated). The collapsed height is
    // defined by the element's own state instead, which is also correct while a
    // close is still in flight (`open` stays true until the animation ends).
    const from = details.open ? body.getBoundingClientRect().height : 0;
    const measuredShift = inner ? currentShift(inner) : 0;

    running.forEach((animation) => animation.cancel());
    running = [];

    // Opening has to happen before the target can be measured — a closed
    // <details> does not lay its content out at all. No paint can slip in
    // between this and `animate()` below, so there is no flash of full height.
    if (open) details.open = true;
    // `getBoundingClientRect()` rather than `scrollHeight`: the former is
    // fractional and matches the natural height exactly, so handing back to
    // `height: auto` at the end does not nudge the layout by a rounding pixel.
    // `scrollHeight` only as a fallback: it is rounded, while the rect is
    // fractional, and a fractional target is what makes the hand-back to
    // `height: auto` seamless.
    const to = open ? body.getBoundingClientRect().height || body.scrollHeight : 0;

    const travel = Math.abs(to - from);
    if (travel < 1) {
      settle(open);
      return;
    }

    const { duration, easing } = open ? OPEN : CLOSE;
    const ms = duration + Math.min(120, travel * 0.25);

    body.style.overflow = 'hidden';

    const heightAnimation = body.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration: ms,
      easing,
    });
    heightAnimation.onfinish = () => settle(open);
    running.push(heightAnimation);

    if (inner) {
      // Fully closed content sits at the pre-open offset; a gesture interrupted
      // mid-flight continues from wherever the text currently is.
      const fromShift = open && from < 1 ? -SLIDE : measuredShift;
      const toShift = open ? 0 : -SLIDE;
      const slideAnimation = inner.animate(
        [{ transform: `translateY(${fromShift}px)` }, { transform: `translateY(${toShift}px)` }],
        { duration: ms, easing },
      );
      running.push(slideAnimation);
    }
  };

  summary.addEventListener('click', (event) => {
    // The summary's own toggle would fight the animation; drive it ourselves.
    event.preventDefault();

    if (prefersReducedMotion()) {
      running.forEach((animation) => animation.cancel());
      running = [];
      details.open = !details.open;
      body.style.removeProperty('overflow');
      target = details.open;
      return;
    }

    animate(!target);
  });
}

export function initDetails(): void {
  const blocks = document.querySelectorAll<HTMLDetailsElement>('details.tag-details');
  blocks.forEach(setupDetails);
}

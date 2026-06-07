/**
 * Shared DOM utilities — query selectors, event binding, debounce, and device detection.
 */
export function $(selector: string, parent: Document | Element = document): Element | null {
  return parent.querySelector(selector);
}

export function $$(selector: string, parent: Document | Element = document): NodeListOf<Element> {
  return parent.querySelectorAll(selector);
}

export function on<K extends keyof HTMLElementEventMap>(
  el: Element | Document | Window,
  event: K,
  handler: (e: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions,
): void {
  el.addEventListener(event, handler as EventListener, options);
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as unknown as T;
}

export function isMobile(): boolean {
  return window.innerWidth < 768;
}

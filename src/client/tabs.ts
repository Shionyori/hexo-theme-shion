/**
 * Tag plugin tabs — client-side interactivity for the {% tabs %} tag plugin.
 */
import { $$, on } from './utils';

export function initTabs(): void {
  const tabsContainers = $$('.tabs');

  tabsContainers.forEach((container) => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-panel');

    buttons.forEach((btn) => {
      on(btn, 'click', () => {
        const tabIndex = (btn as HTMLElement).dataset.tab;
        if (!tabIndex) return;

        buttons.forEach((b) => b.classList.remove('active'));
        panels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = container.querySelector(`.tab-panel[data-tab="${tabIndex}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

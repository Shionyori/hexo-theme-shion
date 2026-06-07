/**
 * Post card click — makes entire post cards clickable while respecting inner links/buttons.
 * Supports Ctrl/Cmd+click to open in new tab.
 */
export function initCardClick(): void {
  document.querySelectorAll('.post-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.target as HTMLElement;

      // Let native links/buttons handle their own clicks
      if (target.closest('a, button')) return;

      // Find the card's overlay link and navigate
      const link = card.querySelector('.post-card-link') as HTMLAnchorElement | null;
      if (!link) return;

      if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
        window.open(link.href, '_blank');
      } else {
        link.click();
      }
    });
  });
}

export function initCardClick(): void {
  document.querySelectorAll('.post-card').forEach((card) => {
    card.addEventListener('click', function (this: HTMLElement, e: MouseEvent) {
      const target = e.target as HTMLElement;

      // Let native links/buttons handle their own clicks
      if (target.closest('a, button')) return;

      // Find the card's overlay link and navigate
      const link = this.querySelector('.post-card-link') as HTMLAnchorElement | null;
      if (!link) return;

      if (e.ctrlKey || e.metaKey) {
        window.open(link.href, '_blank');
      } else {
        link.click();
      }
    });
  });
}

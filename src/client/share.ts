import { on } from './utils';

export function initShare(): void {
  const copyBtn = document.querySelector('.share-copy') as HTMLElement | null;
  if (!copyBtn) return;

  on(copyBtn, 'click', async () => {
    const url = copyBtn.dataset.url;
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      copyBtn.classList.add('copied');
      copyBtn.setAttribute('data-tooltip', 'Copied!');
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.removeAttribute('data-tooltip');
      }, 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      copyBtn.classList.add('copied');
      copyBtn.setAttribute('data-tooltip', 'Copied!');
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.removeAttribute('data-tooltip');
      }, 2000);
    }
  });
}

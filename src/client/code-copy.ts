/**
 * Inject a "Copy" button into every figure.highlight code block.
 *
 * The button is placed in the top-right corner and appears on hover.
 * Clicking it copies the raw code text (excluding line numbers) to the
 * clipboard and briefly shows a "Copied!" state.
 */

function getCodeText(figure: HTMLElement): string {
  const codeCell = figure.querySelector('.code');
  if (!codeCell) return '';
  // Each .line span is display:block; join with newlines.
  const lines = codeCell.querySelectorAll('.line');
  return Array.from(lines)
    .map((line) => line.textContent || '')
    .join('\n');
}

function createCopyButton(): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'code-copy-btn';
  btn.setAttribute('aria-label', 'Copy code');
  btn.textContent = 'Copy';
  return btn;
}

export function initCodeCopy(): void {
  const figures = document.querySelectorAll<HTMLElement>('figure.highlight');

  figures.forEach((figure) => {
    // Skip if we already injected a button (idempotent).
    if (figure.querySelector('.code-copy-btn')) return;

    const btn = createCopyButton();

    btn.addEventListener('click', async () => {
      const text = getCodeText(figure);
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        // Fallback for older browsers or non-HTTPS contexts.
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copy';
            btn.classList.remove('copied');
          }, 2000);
        } catch {
          btn.textContent = 'Error';
          setTimeout(() => {
            btn.textContent = 'Copy';
          }, 2000);
        }
        document.body.removeChild(textarea);
      }
    });

    figure.appendChild(btn);
  });
}

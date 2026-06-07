/**
 * Code copy button — injects a "Copy" button into every figure.highlight code block.
 * The button appears on hover in the top-right corner. Clicking copies raw code text
 * (excluding line numbers) to the clipboard with a "Copied!" feedback state.
 * Falls back to document.execCommand('copy') for older browsers.
 */

function getCodeText(figure: HTMLElement): string {
  const code = figure.querySelector<HTMLElement>('.code code');
  if (!code) return '';

  // Deep-clone so we don't mutate the live DOM, then convert each <br>
  // into a literal newline before extracting textContent.
  const clone = code.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
  return clone.textContent || '';
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

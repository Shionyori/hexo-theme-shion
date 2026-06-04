function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function initHeadingAnchors(): void {
  const headings = document.querySelectorAll(
    '.post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6, .page-content h1, .page-content h2, .page-content h3, .page-content h4, .page-content h5, .page-content h6',
  );

  headings.forEach((heading) => {
    const h = heading as HTMLElement;
    if (h.dataset.anchor || !h.textContent) return;
    h.dataset.anchor = 'true';

    // Use the existing id from the markdown renderer if present,
    // otherwise generate one. Never overwrite existing IDs — the
    // TOC depends on them.
    const id = h.id || slugify(h.textContent.trim());
    if (!id) return;

    // Always ensure the heading has an id for the anchor link
    h.id = id;

    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = `#${id}`;
    anchor.textContent = '#';
    anchor.setAttribute('aria-hidden', 'true');
    h.appendChild(anchor);
  });
}

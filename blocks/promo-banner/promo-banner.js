export default function decorate(block) {
  // Structure: single row with one cell containing image + text overlay
  // The block has: picture element, heading, description, and CTA link
  const row = block.children[0];
  if (!row) return;

  const pic = row.querySelector('picture');
  const link = row.querySelector('a');

  // Build info overlay from content elements
  const info = document.createElement('div');
  info.className = 'promo-banner-info';

  // Gather all non-picture, non-link content (headings, paragraphs)
  const contents = row.querySelectorAll('h2, h3, p');
  contents.forEach((el) => {
    // Skip paragraphs that only contain the picture or the link
    if (el.querySelector('picture') || el.closest('.promo-banner-info')) return;
    const clone = el.cloneNode(true);
    // If paragraph contains an <a>, make it a CTA
    const a = clone.querySelector('a');
    if (a) {
      a.className = 'promo-banner-cta';
    }
    info.append(clone);
  });

  // If there's a standalone link not inside a paragraph, add as CTA
  if (link && !info.querySelector('.promo-banner-cta')) {
    const cta = document.createElement('p');
    const a = link.cloneNode(true);
    a.className = 'promo-banner-cta';
    cta.append(a);
    info.append(cta);
  }

  // Rebuild block structure
  block.textContent = '';

  if (pic) {
    const picWrap = document.createElement('div');
    picWrap.className = 'promo-banner-image';
    picWrap.append(pic);
    block.append(picWrap);
  }

  block.append(info);

  // Wrap entire block in a link if there's one destination
  if (link) {
    block.dataset.href = link.href;
    block.style.cursor = 'pointer';
    block.addEventListener('click', () => {
      window.location.href = link.href;
    });
  }
}

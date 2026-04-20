export default function decorate(block) {
  const items = [...block.children];
  items.forEach((row) => {
    row.classList.add('brand-teaser-card');
    const [imageCell, textCell] = [...row.children];
    if (imageCell) imageCell.classList.add('brand-teaser-image');
    if (textCell) textCell.classList.add('brand-teaser-label');

    // Wrap entire card in a link if there's an anchor in the text cell
    const anchor = textCell?.querySelector('a');
    if (anchor) {
      const link = document.createElement('a');
      link.href = anchor.href;
      link.className = 'brand-teaser-link';
      link.setAttribute('aria-label', anchor.textContent.trim());
      while (row.firstChild) link.append(row.firstChild);
      row.append(link);
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('feature-split-row');
    const cols = [...row.children];
    cols.forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        col.classList.add('feature-split-image');
      } else {
        col.classList.add('feature-split-content');
      }
    });
  });
}

export default function decorate(block) {
  const items = [...block.children];

  items.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const question = cells[0];
    const answer = cells[1];

    // Build accordion item
    row.classList.add('faq-item');

    // Build question button
    const btn = document.createElement('button');
    btn.className = 'faq-question';
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = question.innerHTML;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        answer.style.maxHeight = '0';
      } else {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        // Recalculate after transition in case content reflows
        answer.addEventListener('transitionend', () => {
          if (btn.getAttribute('aria-expanded') === 'true') {
            answer.style.maxHeight = 'none';
          }
        }, { once: true });
      }
    });

    // Build answer panel
    answer.classList.add('faq-answer');
    answer.setAttribute('role', 'region');
    answer.style.maxHeight = '0';

    // Replace original cells with accordion structure
    row.textContent = '';
    row.append(btn, answer);
  });
}

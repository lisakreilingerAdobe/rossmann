import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const cards = [...block.children];
  if (!cards.length) return;

  // Build card list
  const ul = document.createElement('ul');
  ul.className = 'product-cards-slider-cards';

  cards.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'product-cards-slider-card';

    const cols = [...row.children];
    const imageCol = cols[0];
    const bodyCol = cols[1];

    // Image wrapper
    const imageDiv = document.createElement('div');
    imageDiv.className = 'product-cards-slider-card-image';
    const pic = imageCol.querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        imageDiv.append(
          createOptimizedPicture(img.src, img.alt || '', false, [{ width: '400' }]),
        );
      }
    }
    li.append(imageDiv);

    // Body wrapper
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'product-cards-slider-card-body';

    if (bodyCol) {
      const strong = bodyCol.querySelector('strong');
      if (strong) {
        const title = document.createElement('p');
        title.className = 'product-cards-slider-card-title';
        title.textContent = strong.textContent;
        bodyDiv.append(title);
      }

      // Find price paragraph (contains ¬)
      const paragraphs = [...bodyCol.querySelectorAll('p')];
      paragraphs.forEach((p) => {
        if (p.textContent.includes('¬')) {
          const priceEl = document.createElement('p');
          priceEl.className = 'product-cards-slider-card-price';
          priceEl.textContent = p.textContent;
          bodyDiv.append(priceEl);
        }
      });

      // CTA link
      const link = bodyCol.querySelector('a');
      if (link) {
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.className = 'product-cards-slider-card-cta';
        cta.textContent = link.textContent;
        bodyDiv.append(cta);
      }
    }

    li.append(bodyDiv);
    ul.append(li);
  });

  // Build slider wrapper
  block.textContent = '';

  const track = document.createElement('div');
  track.className = 'product-cards-slider-track';
  track.append(ul);

  const prevBtn = document.createElement('button');
  prevBtn.className = 'product-cards-slider-prev';
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = '<span>&#8249;</span>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'product-cards-slider-next';
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = '<span>&#8250;</span>';

  block.append(prevBtn, track, nextBtn);

  // Slider logic
  let currentIndex = 0;

  function getVisibleCount() {
    const w = block.offsetWidth;
    if (w < 600) return 1;
    if (w < 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function updateSlider() {
    const visibleCount = getVisibleCount();
    const cardItems = ul.querySelectorAll('.product-cards-slider-card');
    if (!cardItems.length) return;
    const gap = 24;
    const cardWidth = (track.offsetWidth - gap * (visibleCount - 1)) / visibleCount;
    cardItems.forEach((card) => {
      card.style.minWidth = `${cardWidth}px`;
      card.style.maxWidth = `${cardWidth}px`;
    });
    const offset = currentIndex * (cardWidth + gap);
    ul.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = currentIndex <= 0;
    nextBtn.disabled = currentIndex >= getMaxIndex();
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex += 1;
      updateSlider();
    }
  });

  // Observe resize
  const ro = new ResizeObserver(() => {
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    updateSlider();
  });
  ro.observe(block);

  updateSlider();
}

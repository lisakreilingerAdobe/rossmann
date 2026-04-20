export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // Build slide elements
  const slider = document.createElement('div');
  slider.className = 'hero-slider-slides';

  const dots = document.createElement('ul');
  dots.className = 'hero-slider-dots';
  dots.setAttribute('role', 'tablist');

  rows.forEach((row, i) => {
    const cols = [...row.children];
    const slide = document.createElement('div');
    slide.className = 'hero-slider-slide';
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-label', `Slide ${i + 1} of ${rows.length}`);
    if (i !== 0) slide.setAttribute('aria-hidden', 'true');

    // Image cell
    const imageCell = cols[0];
    if (imageCell) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'hero-slider-slide-image';
      imgWrap.append(...imageCell.childNodes);
      slide.append(imgWrap);
    }

    // Info cell (heading, description, CTA)
    const infoCell = cols[1];
    if (infoCell) {
      const info = document.createElement('div');
      info.className = 'hero-slider-slide-info';
      info.append(...infoCell.childNodes);

      // Style the CTA link
      const ctaLink = info.querySelector('a');
      if (ctaLink) {
        const p = ctaLink.closest('p');
        if (p) p.className = 'hero-slider-cta';
      }
      slide.append(info);
    }

    // Wrap slide in a link if CTA exists
    const link = slide.querySelector('.hero-slider-cta a');
    if (link) {
      const wrapper = document.createElement('a');
      wrapper.href = link.href;
      wrapper.title = link.title || '';
      wrapper.className = 'hero-slider-slide-link';
      wrapper.setAttribute('aria-label', link.title || link.textContent);
      wrapper.append(...slide.childNodes);
      slide.append(wrapper);
    }

    slider.append(slide);

    // Dot
    const li = document.createElement('li');
    li.setAttribute('role', 'presentation');
    const btn = document.createElement('button');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.textContent = i + 1;
    if (i === 0) li.classList.add('active');
    btn.addEventListener('click', () => goToSlide(i));
    li.append(btn);
    dots.append(li);
  });

  block.textContent = '';
  block.append(slider, dots);

  // Slider state
  let current = 0;
  let autoplayTimer = null;
  const slideCount = rows.length;

  function goToSlide(index) {
    current = ((index % slideCount) + slideCount) % slideCount;
    slider.style.transform = `translateX(-${current * 100}%)`;

    // Update slides
    [...slider.children].forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
    });

    // Update dots
    [...dots.children].forEach((li, i) => {
      li.classList.toggle('active', i === current);
      li.querySelector('button').setAttribute('aria-selected', i === current ? 'true' : 'false');
    });

    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function resetAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  // Start autoplay
  resetAutoplay();

  // Pause on hover
  block.addEventListener('mouseenter', () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  });
  block.addEventListener('mouseleave', () => {
    resetAutoplay();
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  block.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  block.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToSlide(current + 1);
      else goToSlide(current - 1);
    }
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  /* 공통 */
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  /*  헤더 애니메이션 */
  const header = $('header');
  if (header) {
    let currentY = 0;
    function animate() {
      const targetY = Math.min(window.scrollY * 0.12, 30);
      currentY += (targetY - currentY) * 0.08;
      header.style.transform = `translateY(${currentY}px)`;
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* 광고디자인 슬라이더 */
  $$('.slider-wrapper').forEach(wrapper => {
    const track = wrapper.querySelector('.slider-track');
    if (!track) return;

    track.innerHTML += track.innerHTML;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let isInertia = false;
    let autoId = null;

    const MAX_VELOCITY = 25;
    const AUTO_SPEED = 0.3;

    function autoSlide() {
      if (isDown || isInertia) return;
      wrapper.scrollLeft += AUTO_SPEED;
      autoId = requestAnimationFrame(autoSlide);
    }
    autoSlide();

    wrapper.addEventListener('mousedown', e => {
      isDown = true;
      isInertia = false;
      startX = e.pageX;
      scrollLeft = wrapper.scrollLeft;
      velocity = 0;
      cancelAnimationFrame(autoId);
    });

    wrapper.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();

      const x = e.pageX;
      const walk = (x - startX) * 1.1;
      const prev = wrapper.scrollLeft;

      wrapper.scrollLeft = scrollLeft - walk;
      velocity = wrapper.scrollLeft - prev;
      velocity = Math.max(Math.min(velocity, MAX_VELOCITY), -MAX_VELOCITY);
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      isInertia = true;

      function inertia() {
        wrapper.scrollLeft += velocity;
        velocity *= 0.92;

        if (Math.abs(velocity) > 0.4) {
          requestAnimationFrame(inertia);
        } else {
          isInertia = false;
          setTimeout(autoSlide, 300);
        }
      }
      inertia();
    });

    wrapper.addEventListener('scroll', () => {
      const half = track.scrollWidth / 2;
      if (wrapper.scrollLeft >= half) wrapper.scrollLeft -= half;
      if (wrapper.scrollLeft <= 0) wrapper.scrollLeft += half;
    });

    wrapper.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });
  });

  /* nav + bottom-nav 스크롤 이동 */
  $$('a[data-target]').forEach(link => {
    link.addEventListener('click', e => {
      const selector = link.dataset.target;
      if (!selector) return;

      const target = document.querySelector(selector);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });

  document.querySelectorAll('header nav ol li').forEach(li => {
  li.addEventListener('click', e => {
    const link = li.querySelector('a[data-target]');
    if (!link) return;

    link.click();
  });
});

/* 맨 위로 가기 */
  const topBtn = $('#topbtn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});

document.addEventListener('click', e => {

  /* show more (home) */
  if (e.target.closest('#toggleBtn')) {
    const btn = e.target.closest('#toggleBtn');
    const moreContent = document.querySelector('#moreContent');
    const arrow = btn.querySelector('.arrow');

    if (!moreContent) return;

    const isOpen = moreContent.classList.toggle('active');
    arrow && arrow.classList.toggle('active', isOpen);

    if (isOpen) {
      setTimeout(() => {
        moreContent.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 200);
    }
  }

  /*  show more (banner) */
  if (e.target.closest('#moreBtn')) {
    const btn = e.target.closest('#moreBtn');
    const content = document.querySelector('#showMoreContent');
    const arrow = btn.querySelector('.rrow');

    if (!content) return;

    const isOpen = content.classList.toggle('active');
    arrow && arrow.classList.toggle('active', isOpen);

    if (isOpen) {
      setTimeout(() => {
        btn.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 200);
    }
  }

});

/* 배너 팝업 */
const popup = document.getElementById('bannerPopup');
const title = popup.querySelector('.popup-title');
const sub = popup.querySelector('.popup-sub');
const groups = popup.querySelectorAll('.popup-group');
const closeBtn = popup.querySelector('.popup-close');

/* 카드 클릭 */
document.querySelectorAll('.banner-card').forEach(card => {
  card.addEventListener('click', () => {
    const type = card.dataset.type;

    groups.forEach(group => {
      group.style.display =
        group.dataset.type === type ? 'block' : 'none';
    });

    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
  });
});

/* 닫기 */
function closePopup() {
  popup.style.display = 'none';
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closePopup);

/* 배경 클릭 닫기 */
popup.addEventListener('click', e => {
  if (e.target === popup) closePopup();
});

/*  배너 페이지 페이드 슬라이드 + 마우스 드래그 */
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.banner-slider');
  const slides = document.querySelectorAll('.banner-slider .slide');
  const dots = document.querySelectorAll('.dot');

  if (!slider || !slides.length) return;

  let currentIndex = 0;
  let timer = null;
  

  /* 슬라이드 표시  */
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentIndex = index;
  }

  function nextSlide() {
    showSlide((currentIndex + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentIndex - 1 + slides.length) % slides.length);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(nextSlide, 3500);
  }

  /* dot 클릭 */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      startAuto();
    });
  });

  /*  마우스 드래그 */
  let startX = 0;
  let isDragging = false;

  slider.addEventListener('mousedown', e => {
    startX = e.pageX;
    isDragging = true;
    clearInterval(timer);
  });

  slider.addEventListener('mousemove', e => {
    if (!isDragging) return;
  });

  slider.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;

    const diff = e.pageX - startX;

    if (Math.abs(diff) > 50) {
      diff < 0 ? nextSlide() : prevSlide();
    }

    startAuto();
  });

  slider.addEventListener('mouseleave', () => {
    isDragging = false;
  });

  /* 이미지 드래그 방지 */
  slider.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
  });

  startAuto();
});


/* 보정 카테고리 */
document.querySelectorAll('.retouch-box').forEach(box => {
  const toggle = box.querySelector('.toggle-wrap');
  const images = box.querySelectorAll('.img-box');

  toggle.addEventListener('click', () => {
    const isBefore = toggle.dataset.state === 'before';
    toggle.dataset.state = isBefore ? 'after' : 'before';

    images.forEach(imgBox => {
      imgBox.querySelector('.before').classList.toggle('active', !isBefore);
      imgBox.querySelector('.after').classList.toggle('active', isBefore);
    });
  });
});

/* 방지 */
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
    (e.ctrlKey && ['c','u','s'].includes(e.key))
  ) {
    e.preventDefault();
  }
});
document.addEventListener('DOMContentLoaded', () => {
  /* 공통 */
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  /* ================= 헤더 애니메이션 ================= */
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

  /* ================= 광고디자인 슬라이더 ================= */
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
    const AUTO_SPEED = 0.6;

    function autoSlide() {
      if (!isDown && !isInertia) {
        wrapper.scrollLeft += AUTO_SPEED;

        // 윈도우 scroll 고착 방지
        if (wrapper.scrollLeft === 0) {
          wrapper.scrollLeft = 1;
        }
      }
      autoId = requestAnimationFrame(autoSlide);
    }
    autoSlide();

    wrapper.addEventListener('mousedown', e => {
      isDown = true;
      isInertia = false;
      startX = e.pageX;
      scrollLeft = wrapper.scrollLeft;
      velocity = 0;
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

  /* ================= nav 스크롤 이동 ================= */
  $$('a[data-target]').forEach(link => {
    link.addEventListener('click', e => {
      const selector = link.dataset.target;
      const target = document.querySelector(selector);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ================= 맨 위로 ================= */
  const topBtn = $('#topbtn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

/* ================= 공통 클릭 이벤트 ================= */
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
        moreContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  /* show more (banner) */
  if (e.target.closest('#moreBtn')) {
    const btn = e.target.closest('#moreBtn');
    const content = document.querySelector('#showMoreContent');
    const arrow = btn.querySelector('.rrow');
    if (!content) return;

    const isOpen = content.classList.toggle('active');
    arrow && arrow.classList.toggle('active', isOpen);

    if (isOpen) {
      setTimeout(() => {
        btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }
});

/* ================= 우클릭 / 단축키 방지 ================= */
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

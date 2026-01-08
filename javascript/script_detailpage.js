// 카테고리 탭
const tabs = document.querySelectorAll('.tab');
const grids = document.querySelectorAll('.card-grid');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    grids.forEach(g => g.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// 팝업
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popup-title');
const popupDesc = document.getElementById('popup-desc');
const popupImageWrap = document.querySelector('.popup-image');
const popupClose = document.querySelector('.popup-close');

document.querySelectorAll('.detail-card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();

    popupTitle.textContent = card.dataset.title || '';
    popupDesc.innerHTML = card.dataset.desc || '';
    popupImageWrap.innerHTML = '';

    if (card.dataset.images) {
      const images = card.dataset.images.split(',');

      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src.trim();
        popupImageWrap.appendChild(img);
      });

    } else if (card.dataset.image) {
      const img = document.createElement('img');
      img.src = card.dataset.image;
      popupImageWrap.appendChild(img);
    }

    popupImageWrap.scrollTop = 0;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

popupClose.addEventListener('click', closePopup);
popup.addEventListener('click', e => {
  if (e.target === popup) closePopup();
});

function closePopup() {
  popup.classList.remove('active');
  document.body.style.overflow = '';
}

// 맨 위로가기 버튼
const scrollTopBtn = document.querySelector('#topbtn');
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

//방지
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
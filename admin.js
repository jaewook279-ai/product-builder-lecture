/* ─── 관리자(C) 공통 JS ─── */

// 사이드바 토글 (모바일)
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
hamburgerBtn && hamburgerBtn.addEventListener('click', () => {
  sidebar && sidebar.classList.add('open');
  sidebarOverlay && (sidebarOverlay.style.display = 'block');
});
sidebarOverlay && sidebarOverlay.addEventListener('click', () => {
  sidebar && sidebar.classList.remove('open');
  sidebarOverlay && (sidebarOverlay.style.display = 'none');
});

// 토스트
function showToast(msg, duration = 2800) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// 탭 전환
document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.tab-nav').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('[data-tab-content]').forEach(c => {
      c.style.display = c.dataset.tabContent === btn.dataset.tab ? '' : 'none';
    });
  });
});

// 필터 칩
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const bar = chip.closest('.search-bar') || chip.parentElement;
    bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// 테이블 체크박스 전체 선택
const selectAll = document.getElementById('selectAll');
selectAll && selectAll.addEventListener('change', () => {
  document.querySelectorAll('.row-check').forEach(c => c.checked = selectAll.checked);
});

// 모달 열기/닫기
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const m = document.getElementById(btn.dataset.modalOpen);
    m && m.classList.add('open');
  });
});
document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const m = btn.closest('.modal-overlay');
    m && m.classList.remove('open');
  });
});

/* ─── 전문가(B) 공통 JS ─── */

// 사이드바 토글 (모바일)
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
  sidebar && sidebar.classList.add('open');
  sidebarOverlay && (sidebarOverlay.style.display = 'block');
}
function closeSidebar() {
  sidebar && sidebar.classList.remove('open');
  sidebarOverlay && (sidebarOverlay.style.display = 'none');
}

hamburgerBtn && hamburgerBtn.addEventListener('click', openSidebar);
sidebarOverlay && sidebarOverlay.addEventListener('click', closeSidebar);

// 토스트 알림
function showToast(msg, duration = 2800) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// 탭 전환
document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('[data-tab-group]') || btn.parentElement;
    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.tab;
    document.querySelectorAll('[data-tab-content]').forEach(c => {
      c.style.display = c.dataset.tabContent === target ? '' : 'none';
    });
  });
});

// 필터 칩
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const group = chip.closest('.filter-bar');
    if (group) group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

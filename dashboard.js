document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

function initDashboard() {
    // Set Header Date
    const now = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const dateEl = document.getElementById('headerDate');
    if (dateEl) {
        dateEl.textContent = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${days[now.getDay()]})`;
    }

    // Sidebar Toggle (Mobile)
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Quota Bar Animation
    const quotaBar = document.getElementById('quotaBar');
    if (quotaBar) {
        setTimeout(() => {
            quotaBar.style.width = '60%';
        }, 300);
    }

    // Field Pills (Quick Ask)
    const pills = document.querySelectorAll('.field-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('selected'));
            pill.classList.add('selected');
        });
    });

    // Quick Ask Submission
    const quickAskSubmit = document.getElementById('quickAskSubmit');
    if (quickAskSubmit) {
        quickAskSubmit.addEventListener('click', () => {
            const text = document.getElementById('quickAskText').value.trim();
            if (!text) {
                showToast('내용을 입력해 주세요', '⚠️');
                return;
            }
            document.getElementById('quickAskText').value = '';
            document.querySelectorAll('.field-pill').forEach(p => p.classList.remove('selected'));
            showToast('전문가 매칭을 요청했습니다! 24시간 내에 연결됩니다', '✅');
        });
    }

    // Modal Handlers
    const modalOverlay = document.getElementById('modalOverlay');
    const navAskBtn = document.getElementById('navAskBtn');
    const headerAskBtn = document.getElementById('headerAskBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');

    const openModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    if (navAskBtn) navAskBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (headerAskBtn) headerAskBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Modal Fields Selection
    const modalFields = document.querySelectorAll('.modal-field-btn');
    modalFields.forEach(btn => {
        btn.addEventListener('click', () => {
            modalFields.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Modal Urgency Selection
    const urgencyBtns = document.querySelectorAll('.urgency-btn');
    urgencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            urgencyBtns.forEach(b => b.classList.remove('active-normal', 'active-urgent'));
            const type = btn.getAttribute('data-urgency');
            btn.classList.add(type === 'urgent' ? 'active-urgent' : 'active-normal');
        });
    });

    // Modal Submit
    if (modalSubmitBtn) {
        modalSubmitBtn.addEventListener('click', () => {
            const text = document.getElementById('modalText').value.trim();
            if (!text) {
                showToast('상황 설명을 입력해 주세요', '⚠️');
                return;
            }
            closeModal();
            document.getElementById('modalText').value = '';
            document.querySelectorAll('.modal-field-btn').forEach(b => b.classList.remove('active'));
            showToast('매칭 요청 완료! 전문가가 곧 배정됩니다 🎉', '✅');
        });
    }

    // Consultation List Items (Toasts)
    document.querySelectorAll('.consult-item').forEach(item => {
        item.addEventListener('click', () => {
            const msg = item.getAttribute('data-msg');
            const icon = item.getAttribute('data-icon');
            showToast(msg, icon);
        });
    });

    // Notification Button
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => showToast('새 알림이 5건 있습니다', '🔔'));
    }

    // Tips click to open modal
    document.querySelectorAll('.tip-tag').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', openModal);
    });

    // ESC Key to close modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });
}

let toastTimer;
function showToast(msg, icon = '✅') {
    clearTimeout(toastTimer);
    const t = document.getElementById('toast');
    const msgEl = document.getElementById('toastMsg');
    const iconEl = document.getElementById('toastIcon');

    if (msgEl) msgEl.textContent = msg;
    if (iconEl) iconEl.textContent = icon;
    if (t) {
        t.classList.add('show');
        toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
    }
}

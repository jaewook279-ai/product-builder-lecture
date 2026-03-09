document.addEventListener('DOMContentLoaded', () => {
    initMatchingPage();
});

function initMatchingPage() {
    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Match Card Toggle
    const matchCards = document.querySelectorAll('.match-card');
    matchCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Avoid toggling if clicking buttons inside
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.attach-item')) return;
            card.classList.toggle('expanded');
        });

        // Toggle button specific
        const toggleBtn = card.querySelector('.mc-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.toggle('expanded');
            });
        }
    });

    // Tab Switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const type = tab.getAttribute('data-type');
            filterCards(type);
        });
    });

    // Time Selection (Card 2)
    const timeBtns = document.querySelectorAll('.time-btn');
    timeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const parent = btn.parentElement;
            parent.querySelectorAll('.time-btn').forEach(b => {
                b.style.background = 'var(--white)';
                b.style.borderColor = 'rgba(14,148,136,.3)';
                b.style.color = 'var(--teal)';
            });
            btn.style.background = 'var(--teal)';
            btn.style.color = 'var(--white)';
            btn.style.borderColor = 'var(--teal)';
            showToast(btn.getAttribute('data-time') + ' 일정을 선택했습니다', '📅');
        });
    });

    // Star Rating (Card 4)
    const starBtns = document.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const rating = parseInt(btn.getAttribute('data-index'));
            starBtns.forEach((s, i) => {
                s.classList.toggle('active', i < rating);
            });
        });
    });

    // Cancel Modal Logic
    const cancelTriggers = document.querySelectorAll('.cancel-trigger');
    const cancelOverlay = document.getElementById('cancelOverlay');
    const modalKeepBtn = document.getElementById('modalKeepBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const reasonBtns = document.querySelectorAll('.reason-btn');

    const openCancelModal = () => {
        if (cancelOverlay) {
            cancelOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeCancelModal = () => {
        if (cancelOverlay) {
            cancelOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    cancelTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            openCancelModal();
        });
    });

    if (modalKeepBtn) modalKeepBtn.addEventListener('click', closeCancelModal);
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            closeCancelModal();
            showToast('상담이 취소됐습니다. 상담 횟수 1회가 차감됩니다', '❌');
        });
    }

    reasonBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            reasonBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    if (cancelOverlay) {
        cancelOverlay.addEventListener('click', (e) => {
            if (e.target === cancelOverlay) closeCancelModal();
        });
    }

    // Generic Toast Triggers
    document.querySelectorAll('[data-toast]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const msg = el.getAttribute('data-toast');
            const icon = el.getAttribute('data-icon') || '✅';
            showToast(msg, icon);
        });
    });

    // Notification Btn
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => showToast('새 알림이 5건 있습니다', '🔔'));
    }

    // Initial state: Expand first card
    setTimeout(() => {
        const card1 = document.getElementById('card1');
        if (card1) card1.classList.add('expanded');
    }, 600);

    // ESC to close modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeCancelModal();
    });
}

function filterCards(type) {
    const cards = document.querySelectorAll('.match-card');
    cards.forEach(card => {
        card.style.display = 'block';
        card.style.animation = 'fadeUpMatch .35s ease both';
    });

    if (type === 'active') {
        document.getElementById('card3').style.display = 'none';
        document.getElementById('card4').style.display = 'none';
    } else if (type === 'waiting') {
        document.getElementById('card1').style.display = 'none';
        document.getElementById('card2').style.display = 'none';
        document.getElementById('card4').style.display = 'none';
    } else if (type === 'done') {
        document.getElementById('card1').style.display = 'none';
        document.getElementById('card2').style.display = 'none';
        document.getElementById('card3').style.display = 'none';
    }
}

let toastTimer;
function showToast(msg, icon = '✅') {
    clearTimeout(toastTimer);
    const toastEl = document.getElementById('toastEl');
    const msgEl = document.getElementById('toastMsg');
    const iconEl = document.getElementById('toastIcon');

    if (msgEl) msgEl.textContent = msg;
    if (iconEl) iconEl.textContent = icon;
    if (toastEl) {
        toastEl.classList.add('show');
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3400);
    }
}

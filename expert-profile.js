document.addEventListener('DOMContentLoaded', () => {
    initProfilePage();
});

function initAskPage() { // This was likely a copy-paste error in my thought, naming it initProfilePage below
}

function initProfilePage() {
    // Rating Bar Animation
    setTimeout(() => {
        const ratings = [
            { id: 'rb5', width: '91%' },
            { id: 'rb4', width: '6.8%' },
            { id: 'rb3', width: '1.2%' },
            { id: 'rb2', width: '0.5%' },
            { id: 'rb1', width: '0.2%' }
        ];
        ratings.forEach(r => {
            const el = document.getElementById(r.id);
            if (el) el.style.width = r.width;
        });
    }, 400);

    // Tab Switching
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            const targetContent = document.getElementById('tab-' + target);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // Schedule Grid Generation
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    const times = ['10시', '11시', '14시', '15시', '16시'];
    const grid = document.getElementById('scheduleGrid');

    if (grid) {
        days.forEach(d => {
            const col = document.createElement('div');
            col.className = 'sch-day';
            col.innerHTML = `<div class="sch-day-label">${d}</div>`;
            
            times.forEach(() => {
                const slot = document.createElement('div');
                const isAvailable = Math.random() > 0.45;
                slot.className = 'sch-slot' + (isAvailable ? ' avail' : ' busy');
                
                if (isAvailable) {
                    slot.addEventListener('click', () => {
                        toast(`${d}요일 상담 예약 페이지로 이동합니다 📅`, '📅');
                    });
                }
                col.appendChild(slot);
            });
            grid.appendChild(col);
        });
    }

    // Favorite Toggle
    const favBtn = document.getElementById('favBtn');
    if (favBtn) {
        favBtn.addEventListener('click', () => {
            const isLiked = favBtn.textContent.includes('🤍');
            favBtn.textContent = isLiked ? '❤️ 찜됨' : '🤍 찜하기';
            toast(isLiked ? '찜 목록에 추가됐습니다 ❤️' : '찜 목록에서 제거됐습니다');
        });
    }

    // Question Buttons
    const askButtons = document.querySelectorAll('.consult-btn');
    askButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toast('질문 등록 화면으로 이동합니다 ✏️', '✏️');
            setTimeout(() => {
                window.location.href = 'ask.html';
            }, 1500);
        });
    });

    // Load More Reviews
    const loadMoreBtn = document.getElementById('loadMoreReviews');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => toast('더 많은 리뷰를 불러옵니다', '📚'));
    }
}

let toastTimer;
function toast(msg, icon = '✅') {
    clearTimeout(toastTimer);
    const toastEl = document.getElementById('toastEl');
    const toastMsg = document.getElementById('toastMsg');

    if (toastMsg) toastMsg.textContent = (icon ? icon + ' ' : '') + msg;
    if (toastEl) {
        toastEl.style.transform = 'translateY(0)';
        toastEl.style.opacity = '1';
        toastTimer = setTimeout(() => {
            toastEl.style.transform = 'translateY(70px)';
            toastEl.style.opacity = '0';
        }, 3000);
    }
}

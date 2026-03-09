document.addEventListener('DOMContentLoaded', () => {
    initHistoryPage();
});

function initHistoryPage() {
    // History Card Expand/Collapse
    const hCards = document.querySelectorAll('.h-card');
    hCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent toggling if a button inside is clicked
            if (e.target.closest('button') || e.target.closest('a')) return;
            
            // Close others if you want only one open (optional)
            // hCards.forEach(c => { if(c !== card) c.classList.remove('expanded'); });
            
            card.classList.toggle('expanded');
        });
    });

    // Tab Filtering
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            toast(`필터: ${tab.textContent} 목록을 불러옵니다`);
        });
    });

    // Filter Selects
    const fieldSelect = document.getElementById('fieldSelect');
    if (fieldSelect) {
        fieldSelect.addEventListener('change', () => toast('분야 필터가 적용됐습니다'));
    }

    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', () => toast('기간 필터가 적용됐습니다'));
    }

    // Search
    const historySearch = document.getElementById('historySearch');
    if (historySearch) {
        historySearch.addEventListener('input', debounce(() => {
            if (historySearch.value.length > 0) {
                toast(`'${historySearch.value}' 검색 중...`);
            }
        }, 500));
    }

    // Generic Toast for buttons
    document.querySelectorAll('[data-toast]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toast(btn.getAttribute('data-toast'));
        });
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

let toastTimer;
function toast(msg) {
    clearTimeout(toastTimer);
    const toastEl = document.getElementById('toastEl');
    const toastMsg = document.getElementById('toastMsg');

    if (toastMsg) toastMsg.textContent = msg;
    if (toastEl) {
        toastEl.style.transform = 'translateY(0)';
        toastEl.style.opacity = '1';
        toastTimer = setTimeout(() => {
            toastEl.style.transform = 'translateY(70px)';
            toastEl.style.opacity = '0';
        }, 2600);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSubscriptionPage();
});

const prices = {
    basic: { monthly: '₩29,900', yearly: '₩24,900' },
    std: { monthly: '₩59,900', yearly: '₩49,900' },
    prem: { monthly: '₩99,900', yearly: '₩82,900' }
};

function initSubscriptionPage() {
    // Billing Toggle
    const monthlyBtn = document.getElementById('monthlyBtn');
    const yearlyBtn = document.getElementById('yearlyBtn');

    if (monthlyBtn && yearlyBtn) {
        monthlyBtn.addEventListener('click', () => setBilling('monthly'));
        yearlyBtn.addEventListener('click', () => setBilling('yearly'));
    }

    // Generic Toast Triggers
    const toastTriggers = [
        { id: 'changeCardBtn', msg: '카드를 변경합니다 💳' },
        { id: 'addCardBtn', msg: '결제 수단을 추가합니다 ➕' },
        { id: 'cancelSubBtn', msg: '해지 신청 페이지로 이동합니다. 해지 전 마지막으로 확인해 드릴게요.' }
    ];

    toastTriggers.forEach(item => {
        const el = document.getElementById(item.id);
        if (el) el.addEventListener('click', () => toast(item.msg));
    });

    document.querySelectorAll('[data-toast]').forEach(el => {
        el.addEventListener('click', () => toast(el.getAttribute('data-toast')));
    });

    document.querySelectorAll('[data-msg]').forEach(el => {
        el.addEventListener('click', () => toast(el.getAttribute('data-msg')));
    });
}

function setBilling(type) {
    const monthlyBtn = document.getElementById('monthlyBtn');
    const yearlyBtn = document.getElementById('yearlyBtn');
    
    if (type === 'monthly') {
        monthlyBtn.classList.add('active');
        yearlyBtn.classList.remove('active');
    } else {
        yearlyBtn.classList.add('active');
        monthlyBtn.classList.remove('active');
    }

    const periodText = type === 'yearly' ? '/월 (연간 청구)' : '/월';
    const priceKey = type;

    document.getElementById('basicPrice').textContent = prices.basic[priceKey];
    document.getElementById('stdPrice').textContent = prices.std[priceKey];
    document.getElementById('premPrice').textContent = prices.prem[priceKey];

    document.getElementById('basicPeriod').textContent = periodText;
    document.getElementById('stdPeriod').textContent = periodText;
    document.getElementById('premPeriod').textContent = periodText;

    toast(type === 'yearly' ? '연간 결제로 전환됐습니다. 17% 할인 적용!' : '월간 결제로 전환됐습니다.');
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
        }, 3200);
    }
}

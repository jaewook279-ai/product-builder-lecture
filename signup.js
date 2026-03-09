let selectedRole = 'owner';
let currentStep = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Role Selection
    const roleOwner = document.getElementById('role-owner');
    const roleExpert = document.getElementById('role-expert');

    if (roleOwner && roleExpert) {
        roleOwner.addEventListener('click', () => selectRole('owner'));
        roleExpert.addEventListener('click', () => selectRole('expert'));
    }

    // Step Navigation
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.getAttribute('data-next'));
            goStep(nextStep);
        });
    });

    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.getAttribute('data-prev'));
            goStep(prevStep);
        });
    });

    const emailContinueBtn = document.getElementById('emailContinueBtn');
    if (emailContinueBtn) {
        emailContinueBtn.addEventListener('click', () => goStep(2));
    }

    // Input Validations
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.addEventListener('input', (e) => checkEmail(e.target));
    }

    const pwInput = document.getElementById('pwInput');
    if (pwInput) {
        pwInput.addEventListener('input', (e) => checkPw(e.target));
    }

    // Social & Verify Buttons (Toast)
    const toastButtons = [
        { id: 'kakaoBtn', msg: '카카오 로그인을 시작합니다', icon: '💛' },
        { id: 'naverBtn', msg: '네이버 로그인을 시작합니다', icon: '💚' },
        { id: 'emailVerifyBtn', msg: '인증 메일을 발송했습니다', icon: '✉️' },
        { id: 'phoneVerifyBtn', msg: '인증번호를 발송했습니다', icon: '📱' },
        { id: 'bizVerifyBtn', msg: '사업자번호를 확인합니다', icon: '✅' },
        { id: 'addressInput', msg: '주소 검색을 시작합니다', icon: '📍' }
    ];

    toastButtons.forEach(btn => {
        const el = document.getElementById(btn.id);
        if (el) {
            el.addEventListener('click', () => toast(btn.msg, btn.icon));
        }
    });

    // Terms (All Check)
    const allCheck = document.getElementById('allCheck');
    if (allCheck) {
        allCheck.addEventListener('change', (e) => {
            document.querySelectorAll('.term-chk').forEach(chk => {
                chk.checked = e.target.checked;
            });
        });
    }
}

function selectRole(role) {
    selectedRole = role;
    document.getElementById('role-owner').classList.toggle('selected', role === 'owner');
    document.getElementById('role-expert').classList.toggle('selected', role === 'expert');
}

function goStep(n) {
    currentStep = n;
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    const targetStep = document.getElementById('step' + n);
    if (targetStep) targetStep.classList.add('active');

    // Update Step Bar
    for (let i = 1; i <= 4; i++) {
        const circle = document.getElementById('sc' + i);
        const line = document.getElementById('sl' + i);
        
        if (circle) {
            if (i < n) {
                circle.className = 'sb-circle done';
                circle.textContent = '✓';
            } else if (i === n) {
                circle.className = 'sb-circle active';
                circle.textContent = (i === 4) ? '✓' : i;
            } else {
                circle.className = 'sb-circle wait';
                circle.textContent = (i === 4) ? '✓' : i;
            }
        }
        
        if (line) {
            line.className = 'sb-line' + (i < n ? ' done' : '');
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkEmail(el) {
    const isValid = el.value.includes('@') && el.value.includes('.');
    el.classList.toggle('success', isValid);
    el.classList.toggle('error', el.value.length > 0 && !isValid);
}

function checkPw(el) {
    const v = el.value;
    const l = v.length;
    const bar = document.getElementById('pwBar');
    const lbl = document.getElementById('pwLabel');
    
    if (!bar || !lbl) return;

    const hasNum = /\d/.test(v);
    const hasSpec = /[!@#$%^&*]/.test(v);
    
    let strength = 0;
    if (l >= 8) strength++;
    if (hasNum) strength++;
    if (hasSpec) strength++;
    if (l >= 12) strength++;

    if (l === 0) {
        bar.style.width = '0%';
        lbl.textContent = '비밀번호를 입력해 주세요';
        lbl.style.color = 'var(--gray-4)';
        return;
    }

    let color = '';
    let text = '';

    if (strength <= 1) {
        color = 'var(--red)';
        text = '약함';
    } else if (strength === 2) {
        color = 'var(--amber)';
        text = '보통';
    } else if (strength === 3) {
        color = 'var(--blue)';
        text = '강함';
    } else {
        color = 'var(--green)';
        text = '매우 강함';
    }

    bar.style.width = (strength * 25) + '%';
    bar.style.background = color;
    lbl.textContent = text;
    lbl.style.color = color;
}

let toastTimer;
function toast(msg, icon = '✅') {
    clearTimeout(toastTimer);
    const ti = document.getElementById('ti');
    const tm = document.getElementById('tm');
    const toastEl = document.getElementById('toastEl');

    if (ti) ti.textContent = icon;
    if (tm) tm.textContent = msg;
    if (toastEl) {
        toastEl.classList.add('show');
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
    }
}

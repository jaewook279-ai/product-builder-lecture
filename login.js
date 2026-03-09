document.addEventListener('DOMContentLoaded', () => {
    setupLoginHandlers();
});

let rememberMe = false;
let showPassword = false;

function setupLoginHandlers() {
    // Remember Me Toggle
    const rememberBtn = document.getElementById('rememberBtn');
    if (rememberBtn) {
        rememberBtn.addEventListener('click', () => {
            rememberMe = !rememberMe;
            document.getElementById('remChk').className = 'chk-sm' + (rememberMe ? ' on' : '');
        });
    }

    // Password Visibility Toggle
    const pwToggle = document.getElementById('pwToggle');
    if (pwToggle) {
        pwToggle.addEventListener('click', () => {
            showPassword = !showPassword;
            const pwIn = document.getElementById('pwIn');
            pwIn.type = showPassword ? 'text' : 'password';
            pwToggle.textContent = showPassword ? '🙈' : '👁️';
        });
    }

    // Form Submission
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', () => doLogin());
    }

    // Social & Link Buttons
    const socialButtons = [
        { id: 'kakaoLoginBtn', msg: '카카오로 로그인합니다', icon: '🟡' },
        { id: 'naverLoginBtn', msg: '네이버로 로그인합니다', icon: '🟢' }
    ];

    socialButtons.forEach(btn => {
        const el = document.getElementById(btn.id);
        if (el) {
            el.addEventListener('click', () => toast(btn.msg, btn.icon));
        }
    });

    const forgotPwLink = document.getElementById('forgotPwLink');
    if (forgotPwLink) {
        forgotPwLink.addEventListener('click', (e) => {
            e.preventDefault();
            toast('비밀번호 재설정 이메일을 발송했습니다 📧', '📧');
        });
    }
}

function doLogin() {
    const email = document.getElementById('emailIn').value.trim();
    const password = document.getElementById('pwIn').value;
    const errorBox = document.getElementById('errorBox');

    if (!email || !password) {
        if (errorBox) errorBox.classList.add('show');
        return;
    }

    if (errorBox) errorBox.classList.remove('show');
    toast('로그인 중...', '🚀');
    
    // Simulate successful login
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1200);
}

let toastTimer;
function toast(msg, icon = '') {
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

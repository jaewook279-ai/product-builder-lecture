document.addEventListener('DOMContentLoaded', () => {
    initVideoPage();
});

let sec = 0;
let timerInterval;
const states = { mic: true, cam: true };
let isSharing = false;
const replies = ['네, 그 부분이 중요합니다!', '바로 확인해드릴게요.', '좋은 질문이에요! 설명드릴게요.', '이 서류가 필요합니다.'];
let replyIdx = 0;

function initVideoPage() {
    // Timer
    timerInterval = setInterval(() => {
        sec++;
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        const timerEl = document.getElementById('timer');
        const totalTimeEl = document.getElementById('totalTime');
        if (timerEl) timerEl.textContent = `${m}:${s}`;
        if (totalTimeEl) totalTimeEl.textContent = `${m}:${s}`;
    }, 1000);

    // Controls
    const micBtn = document.getElementById('micBtn');
    const camBtn = document.getElementById('camBtn');
    const shareBtn = document.getElementById('shareBtn');
    const recordBtn = document.getElementById('recordBtn');
    const chatBtn = document.getElementById('chatBtn');
    const endBtn = document.getElementById('endBtn');

    if (micBtn) micBtn.addEventListener('click', () => toggleCtrl('mic'));
    if (camBtn) camBtn.addEventListener('click', () => toggleCtrl('cam'));
    if (shareBtn) shareBtn.addEventListener('click', toggleShare);
    if (recordBtn) recordBtn.addEventListener('click', () => toast('녹화를 시작합니다 🔴', '🔴'));
    if (chatBtn) chatBtn.addEventListener('click', () => toast('채팅창을 엽니다 💬', '💬'));
    if (endBtn) endBtn.addEventListener('click', openEndModal);

    // Chat
    const scSendBtn = document.getElementById('scSendBtn');
    const scInput = document.getElementById('scInput');
    if (scSendBtn) scSendBtn.addEventListener('click', sendScMsg);
    if (scInput) {
        scInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendScMsg();
        });
    }

    // Modal
    const continueBtn = document.getElementById('continueBtn');
    const confirmEndBtn = document.getElementById('confirmEndBtn');
    const endOverlay = document.getElementById('endOverlay');

    if (continueBtn) continueBtn.addEventListener('click', closeEndModal);
    if (confirmEndBtn) confirmEndBtn.addEventListener('click', endCall);
    if (endOverlay) {
        endOverlay.addEventListener('click', (e) => {
            if (e.target === endOverlay) closeEndModal();
        });
    }

    // Settings
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.addEventListener('click', () => toast('설정을 엽니다', '⚙️'));
}

function toggleCtrl(type) {
    states[type] = !states[type];
    const iconId = type === 'mic' ? 'micIcon' : 'camIcon';
    const el = document.getElementById(iconId);
    if (!el) return;

    el.classList.toggle('on', !states[type]);
    if (type === 'mic') el.textContent = states[type] ? '🎤' : '🔇';
    else el.textContent = states[type] ? '📹' : '🚫';

    toast((type === 'mic' ? '마이크' : '카메라') + (states[type] ? ' 켜짐' : ' 꺼짐'));
}

function toggleShare() {
    isSharing = !isSharing;
    const overlay = document.getElementById('shareOverlay');
    const icon = document.getElementById('shareIcon');
    if (overlay) overlay.classList.toggle('show', isSharing);
    if (icon) icon.style.background = isSharing ? 'rgba(22, 163, 74, .25)' : 'rgba(52, 152, 219, .25)';
    toast(isSharing ? '화면 공유를 시작합니다 💻' : '화면 공유를 종료했습니다', '💻');
}

function sendScMsg() {
    const input = document.getElementById('scInput');
    const text = input.value.trim();
    if (!text) return;

    const msgs = document.getElementById('scMsgs');
    if (!msgs) return;

    const el = document.createElement('div');
    el.className = 'sc-msg me';
    el.innerHTML = `<div class="sc-msg-name">나</div><div class="sc-bubble">${text}</div>`;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    input.value = '';

    setTimeout(() => {
        const r = document.createElement('div');
        r.className = 'sc-msg you';
        r.innerHTML = `<div class="sc-msg-name">김세무 세무사</div><div class="sc-bubble">${replies[replyIdx % replies.length]}</div>`;
        replyIdx++;
        msgs.appendChild(r);
        msgs.scrollTop = msgs.scrollHeight;
    }, 1200);
}

function openEndModal() {
    const el = document.getElementById('endOverlay');
    if (el) el.classList.add('show');
}

function closeEndModal() {
    const el = document.getElementById('endOverlay');
    if (el) el.classList.remove('show');
}

function endCall() {
    clearInterval(timerInterval);
    // Redirect to review page
    toast('상담이 종료되었습니다. 리뷰 페이지로 이동합니다.', '📵');
    setTimeout(() => {
        window.location.href = 'review.html';
    }, 1500);
}

let toastTimer;
function toast(msg, icon = '✅') {
    clearTimeout(toastTimer);
    const toastEl = document.getElementById('toastEl');
    const toastMsg = document.getElementById('toastMsg');
    if (toastMsg) toastMsg.textContent = icon + ' ' + msg;
    if (toastEl) {
        toastEl.classList.add('show-t');
        toastTimer = setTimeout(() => toastEl.classList.remove('show-t'), 2800);
    }
}

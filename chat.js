document.addEventListener('DOMContentLoaded', () => {
    initChatPage();
});

const expertReplies = [
    "물론이죠! 언제든지 추가로 궁금하신 점 질문해 주세요. 꼼꼼하게 도와드릴게요! 😊",
    "체크리스트 작성하시면서 모르는 항목 있으면 바로 여쭤보세요. 제가 옆에서 도와드릴게요.",
    "배달앱 정산서 받으면 바로 매출 합산해서 신고 예상 금액 알려드릴게요!",
    "모든 자료 준비되시면 홈택스에서 신고서 제출까지 단계별로 함께 진행해요. 어렵지 않습니다! 👍",
];
let replyIdx = 0;

function initChatPage() {
    scrollBottom(false);

    // Room Switching
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach(item => {
        item.addEventListener('click', () => {
            roomItems.forEach(r => r.classList.remove('active'));
            item.classList.add('active');
            const unread = item.querySelector('.ri-unread');
            if (unread) unread.remove();
            toast(`${item.querySelector('.ri-name').textContent}님과의 대화창으로 이동합니다`, '💬');
        });
    });

    // Chat Input Handlers
    const msgInput = document.getElementById('msgInput');
    const sendBtn = document.getElementById('sendBtn');

    if (msgInput) {
        msgInput.addEventListener('input', () => {
            autoResize(msgInput);
            if (sendBtn) sendBtn.disabled = !msgInput.value.trim();
        });

        msgInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Attachment
    const attachBtn = document.getElementById('attachBtn');
    if (attachBtn) {
        attachBtn.addEventListener('click', triggerAttach);
    }

    const removeAttachBtn = document.getElementById('removeAttachBtn');
    if (removeAttachBtn) {
        removeAttachBtn.addEventListener('click', removeAttach);
    }

    // Quick Replies
    const quickReplyBtn = document.getElementById('quickReplyBtn');
    const quickReplies = document.getElementById('quickReplies');
    if (quickReplyBtn && quickReplies) {
        quickReplyBtn.addEventListener('click', () => {
            quickReplies.classList.toggle('show');
        });
    }

    const qrBtns = document.querySelectorAll('.qr-btn');
    qrBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (msgInput) {
                msgInput.value = btn.textContent.trim();
                autoResize(msgInput);
                if (sendBtn) sendBtn.disabled = false;
                quickReplies.classList.remove('show');
                msgInput.focus();
            }
        });
    });

    // Panels & Headers
    const infoBtn = document.getElementById('infoBtn');
    const contextPanel = document.getElementById('contextPanel');
    const closeInfoBtn = document.getElementById('closeInfoBtn');

    const toggleContext = () => {
        if (contextPanel) {
            const isHidden = window.getComputedStyle(contextPanel).display === 'none';
            contextPanel.style.display = isHidden ? 'flex' : 'none';
        }
    };

    if (infoBtn) infoBtn.addEventListener('click', toggleContext);
    if (closeInfoBtn) closeInfoBtn.addEventListener('click', toggleContext);

    // Modal
    const completeBtn = document.getElementById('completeBtn');
    const completeOverlay = document.getElementById('completeOverlay');
    const closeOverlayBtn = document.getElementById('closeOverlayBtn');
    const laterBtn = document.getElementById('laterBtn');
    const submitReviewBtn = document.getElementById('submitReviewBtn');

    if (completeBtn) completeBtn.addEventListener('click', () => {
        if (completeOverlay) {
            completeOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });

    const hideOverlay = () => {
        if (completeOverlay) {
            completeOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    };

    if (closeOverlayBtn) closeOverlayBtn.addEventListener('click', hideOverlay);
    if (laterBtn) laterBtn.addEventListener('click', hideOverlay);
    
    if (completeOverlay) {
        completeOverlay.addEventListener('click', (e) => {
            if (e.target === completeOverlay) hideOverlay();
        });
    }

    // Stars
    const stars = document.querySelectorAll('.modal-star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const idx = parseInt(star.getAttribute('data-index'));
            stars.forEach((s, i) => {
                s.classList.toggle('active', i < idx);
            });
        });
    });

    if (submitReviewBtn) {
        submitReviewBtn.addEventListener('click', () => {
            hideOverlay();
            toast('상담이 완료됐습니다. 리뷰 감사합니다! 🎉', '🎉');
            setTimeout(() => toast('다음 번에도 이용해 주세요 😊', '⭐'), 3800);
        });
    }

    // ESC
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') hideOverlay();
    });
}

function scrollBottom(smooth = true) {
    const el = document.getElementById('chatMessages');
    if (el) {
        el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function triggerAttach() {
    const files = ['배달앱_정산서_1월.pdf', '세금계산서_사본.jpg', '매출장부_1월.xlsx'];
    const f = files[Math.floor(Math.random() * files.length)];
    const nameEl = document.getElementById('attachFileName');
    const previewEl = document.getElementById('attachPreview');
    if (nameEl && previewEl) {
        nameEl.textContent = f;
        previewEl.classList.add('show');
        toast('파일이 첨부됐습니다: ' + f, '📎');
    }
}

function removeAttach() {
    const previewEl = document.getElementById('attachPreview');
    if (previewEl) previewEl.classList.remove('show');
}

function sendMessage() {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;

    const msgs = document.getElementById('chatMessages');
    const tr = document.getElementById('typingRow');
    const typingIndicator = document.getElementById('typingIndicator');

    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const row = document.createElement('div');
    row.className = 'msg-row me';
    row.innerHTML = `
      <div class="msg-group">
        <div class="bubble me">${escHtml(text)}</div>
        <div class="msg-time-read"><span class="msg-time">${time}</span><span class="msg-read">✓ 전송됨</span></div>
      </div>
      <div class="msg-avatar invisible"></div>
    `;
    if (tr) msgs.insertBefore(row, tr);
    else msgs.appendChild(row);

    removeAttach();
    input.value = '';
    input.style.height = 'auto';
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.disabled = true;
    scrollBottom();

    // typing
    setTimeout(() => {
        if (tr) tr.style.display = 'flex';
        if (typingIndicator) typingIndicator.style.display = 'inline';
        scrollBottom();
    }, 600);

    // reply
    setTimeout(() => {
        if (tr) tr.style.display = 'none';
        if (typingIndicator) typingIndicator.style.display = 'none';
        const replyText = expertReplies[replyIdx % expertReplies.length];
        replyIdx++;
        addExpertMsg(replyText);
    }, 2200 + Math.random() * 1000);
}

function addExpertMsg(text) {
    const msgs = document.getElementById('chatMessages');
    const tr = document.getElementById('typingRow');
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const row = document.createElement('div');
    row.className = 'msg-row you';
    row.innerHTML = `
      <div class="msg-avatar">👨‍💼</div>
      <div class="msg-group">
        <div class="bubble you">${escHtml(text)}</div>
        <div class="msg-time-read" style="justify-content:flex-start;"><span class="msg-time">${time}</span></div>
      </div>
    `;
    if (tr) msgs.insertBefore(row, tr);
    else msgs.appendChild(row);
    scrollBottom();
}

function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

let toastTimer;
function toast(msg, icon = '✅') {
    clearTimeout(toastTimer);
    const toastEl = document.getElementById('toastEl');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    if (toastMsg) toastMsg.textContent = msg;
    if (toastIcon) toastIcon.textContent = icon;
    if (toastEl) {
        toastEl.classList.add('show');
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3400);
    }
}

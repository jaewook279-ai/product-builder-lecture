document.addEventListener('DOMContentLoaded', () => {
    initAskPage();
});

let curStep = 1;
let selField = '세무·회계';
let selFieldLabel = '💰 세무·회계';
let urgency = 'normal';
let files = [];

const aiKeywords = {
    '세무': ['부가세', '종합소득세', '세금계산서', '공제', '절세'],
    '노무': ['주휴수당', '4대보험', '퇴직금', '근로계약서', '최저임금'],
    '법무': ['임대차', '계약', '분쟁', '보증금', '상가권리금'],
    '마케팅': ['배달앱', 'SNS', '키워드', '리뷰 관리', '광고'],
    'DX': ['POS', '키오스크', '배달연동', '예약시스템'],
    '위생': ['위생점검', '식품안전', 'HACCP', '소방']
};

const fakeFiles = [
    { n: '매출_세금계산서.pdf', s: '2.4 MB', i: '📄' },
    { n: '간이영수증_사본.jpg', s: '840 KB', i: '🖼️' },
    { n: '사업자등록증.pdf', s: '1.2 MB', i: '📄' }
];
let fakeIdx = 0;

function initAskPage() {
    // Field Selection
    const fieldCards = document.querySelectorAll('.field-card');
    const nextBtn1 = document.getElementById('nextBtn1');

    fieldCards.forEach(card => {
        card.addEventListener('click', () => {
            fieldCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            selField = card.getAttribute('data-field');
            selFieldLabel = card.getAttribute('data-label');
            
            if (nextBtn1) {
                nextBtn1.disabled = false;
                nextBtn1.style.opacity = '1';
                nextBtn1.style.cursor = 'pointer';
            }
            
            const previewField = document.getElementById('previewField');
            if (previewField) previewField.textContent = selFieldLabel;
        });
    });

    // Step Navigation
    const nextBtn2 = document.getElementById('nextBtn2');
    const backBtn2 = document.getElementById('backBtn2');
    const backBtn3 = document.getElementById('backBtn3');

    if (nextBtn1) nextBtn1.addEventListener('click', () => goStep(2));
    if (nextBtn2) nextBtn2.addEventListener('click', () => goStep(3));
    if (backBtn2) backBtn2.addEventListener('click', () => goStep(1));
    if (backBtn3) backBtn3.addEventListener('click', () => goStep(2));

    // Input Handlers
    const qTitle = document.getElementById('qTitle');
    const qBody = document.getElementById('qBody');

    if (qTitle) {
        qTitle.addEventListener('input', () => {
            updateCharCount('qTitle', 'titleCount', 50);
            updatePreview();
        });
    }

    if (qBody) {
        qBody.addEventListener('input', () => {
            updateCharCount('qBody', 'bodyCount', 500);
            checkAI();
            updatePreview();
        });
    }

    // Urgency Selection
    const urgencyCards = document.querySelectorAll('.urgency-card');
    urgencyCards.forEach(card => {
        card.addEventListener('click', () => {
            urgencyCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            urgency = card.getAttribute('data-urgency');
            
            const previewUrgency = document.getElementById('previewUrgency');
            if (previewUrgency) {
                previewUrgency.textContent = urgency === 'urgent' ? '🚨 긴급 상담' : '⏰ 일반 상담';
                previewUrgency.style.background = urgency === 'urgent' ? 'var(--red-l)' : 'var(--light)';
                previewUrgency.style.color = urgency === 'urgent' ? 'var(--red)' : 'var(--blue)';
            }
        });
    });

    // File Upload Simulation
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
        dropzone.addEventListener('click', addFakeFile);
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag');
        });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag');
            addFakeFile();
        });
    }

    // Final Submit
    const finalSubmitBtn = document.getElementById('finalSubmitBtn');
    if (finalSubmitBtn) {
        finalSubmitBtn.addEventListener('click', submitQuestion);
    }

    // Notification Btn
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => toast('알림을 확인합니다', '🔔'));
    }
}

function goStep(n) {
    if (n === 3) {
        const title = document.getElementById('qTitle').value.trim();
        const body = document.getElementById('qBody').value.trim();
        if (!title || !body) {
            toast('제목과 질문 내용을 입력해 주세요 ✏️');
            return;
        }
    }
    
    curStep = n;
    [1, 2, 3].forEach(i => {
        const stepEl = document.getElementById('step' + i);
        if (stepEl) stepEl.style.display = (i === n) ? 'block' : 'none';
    });

    const subtitles = ['1단계 — 전문 분야 선택', '2단계 — 질문 작성', '3단계 — 확인 및 제출'];
    const subtitleEl = document.getElementById('stepSubtitle');
    if (subtitleEl) subtitleEl.textContent = subtitles[n - 1];

    updateStepBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepBar() {
    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById('sc' + i);
        const label = document.getElementById('sl' + i);
        const connector = document.getElementById('conn' + i);

        if (circle) {
            if (i < curStep) {
                circle.className = 'step-circle done';
                circle.textContent = '✓';
            } else if (i === curStep) {
                circle.className = 'step-circle active';
                circle.textContent = i;
            } else {
                circle.className = 'step-circle wait';
                circle.textContent = i;
            }
        }

        if (label) {
            if (i < curStep) label.className = 'step-label done';
            else if (i === curStep) label.className = 'step-label active';
            else label.className = 'step-label';
        }

        if (connector) {
            connector.className = 'step-connector' + (i < curStep ? ' done' : '');
        }
    }
}

function updateCharCount(id, countId, max) {
    const input = document.getElementById(id);
    const countEl = document.getElementById(countId);
    if (!input || !countEl) return;

    const val = input.value.length;
    countEl.textContent = `${val} / ${max}자`;
    countEl.className = 'char-count' + (val > max ? ' over' : val > max * 0.85 ? ' warn' : '');
}

function checkAI() {
    const body = document.getElementById('qBody').value;
    const suggestEl = document.getElementById('aiSuggest');
    const tagsEl = document.getElementById('aiTags');
    
    if (!suggestEl || !tagsEl) return;

    if (body.length < 10) {
        suggestEl.classList.remove('show');
        return;
    }

    const key = Object.keys(aiKeywords).find(k => selField.includes(k) || body.includes(k)) || '세무';
    const tags = aiKeywords[key] || [];
    
    tagsEl.innerHTML = tags.map(t => `<span class="ai-tag" data-tag="${t}">${t} +</span>`).join('');
    
    // Add event listeners to tags
    tagsEl.querySelectorAll('.ai-tag').forEach(tagSpan => {
        tagSpan.addEventListener('click', () => {
            const tag = tagSpan.getAttribute('data-tag');
            addTag(tagSpan, tag);
        });
    });

    suggestEl.classList.add('show');
}

function addTag(el, tag) {
    const ta = document.getElementById('qBody');
    if (!ta) return;

    ta.value = (ta.value + ' ' + tag).trim();
    el.style.opacity = '.4';
    el.style.pointerEvents = 'none';
    updateCharCount('qBody', 'bodyCount', 500);
    updatePreview();
}

function addFakeFile() {
    if (fakeIdx >= fakeFiles.length) {
        toast('더 이상 추가할 파일이 없습니다 (데모)');
        return;
    }
    
    const f = fakeFiles[fakeIdx++];
    files.push(f);
    
    const fileList = document.getElementById('fileList');
    if (!fileList) return;

    const el = document.createElement('div');
    el.className = 'file-item';
    el.innerHTML = `
        <span class="fi-icon">${f.i}</span>
        <span class="fi-name">${f.n}</span>
        <span class="fi-size">${f.s}</span>
        <button class="fi-del">✕</button>
    `;
    
    el.querySelector('.fi-del').addEventListener('click', () => {
        el.remove();
        files = files.filter(item => item.n !== f.n);
        updateFilePreview();
    });

    fileList.appendChild(el);
    updateFilePreview();
}

function updateFilePreview() {
    const previewFiles = document.getElementById('previewFiles');
    if (previewFiles) {
        previewFiles.textContent = files.length ? `📎 첨부파일 ${files.length}개` : '📎 첨부파일 없음';
    }
}

function updatePreview() {
    const pTitle = document.getElementById('previewTitle');
    const pBody = document.getElementById('previewBody');
    const qTitle = document.getElementById('qTitle');
    const qBody = document.getElementById('qBody');

    if (pTitle && qTitle) pTitle.textContent = qTitle.value || '질문 제목이 여기에 표시됩니다';
    if (pBody && qBody) pBody.textContent = qBody.value || '질문 내용이 여기에 표시됩니다.';
}

function submitQuestion() {
    toast('전문가 매칭이 요청됐습니다! 🎉 매칭 현황에서 확인하세요');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1800);
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
        }, 3200);
    }
}

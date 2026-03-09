document.addEventListener('DOMContentLoaded', () => {
    initNotificationPage();
});

function initNotificationPage() {
    // Master Toggle
    const masterToggle = document.getElementById('masterToggle');
    if (masterToggle) {
        masterToggle.addEventListener('change', () => {
            const on = masterToggle.checked;
            document.getElementById('masterLabel').textContent = on ? '켜짐' : '꺼짐';
            document.querySelectorAll('.settings-card input[type=checkbox]').forEach(sw => {
                sw.checked = on;
            });
            toast(on ? '전체 알림이 켜졌습니다 🔔' : '전체 알림이 꺼졌습니다 🔕', on ? '🔔' : '🔕');
            markUnsaved();
        });
    }

    // Section Master Toggles
    document.querySelectorAll('.section-master').forEach(master => {
        master.addEventListener('change', () => {
            const on = master.checked;
            const card = master.closest('.settings-card');
            card.querySelectorAll('.setting-row input[type=checkbox]').forEach(sw => sw.checked = on);
            toast(on ? '섹션 알림을 켰습니다' : '섹션 알림을 껐습니다', on ? '✅' : '🔕');
            markUnsaved();
        });
    });

    // Channel Buttons
    const chBtns = document.querySelectorAll('.ch-btn');
    chBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('on');
            updateChannelCounts();
            markUnsaved();
        });
    });

    // DND Toggle
    const dndToggle = document.getElementById('dndToggle');
    const dndBody = document.getElementById('dndBody');
    if (dndToggle && dndBody) {
        dndToggle.addEventListener('change', () => {
            dndBody.style.display = dndToggle.checked ? 'block' : 'none';
            toast(dndToggle.checked ? '방해금지 시간이 설정됐습니다 🌙' : '방해금지 시간이 해제됐습니다', dndToggle.checked ? '🌙' : '☀️');
            markUnsaved();
        });
    }

    // Day Buttons
    const dayBtns = document.querySelectorAll('.day-btn');
    dayBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            btn.classList.toggle('active');
            markUnsaved();
        });
    });

    const allDaysBtn = document.getElementById('allDaysBtn');
    if (allDaysBtn) {
        allDaysBtn.addEventListener('click', () => {
            dayBtns.forEach(b => b.classList.add('active'));
            markUnsaved();
        });
    }

    // Item toggles
    document.querySelectorAll('.item-toggle').forEach(sw => {
        sw.addEventListener('change', markUnsaved);
    });

    // Read Actions
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllRead);
    }

    document.querySelectorAll('.notif-item').forEach(item => {
        item.addEventListener('click', () => readItem(item.id));
    });

    // Header buttons
    const headerNotifBtn = document.getElementById('headerNotifBtn');
    if (headerNotifBtn) headerNotifBtn.addEventListener('click', () => toast('알림을 확인합니다', '🔔'));

    const headerSaveBtn = document.getElementById('headerSaveBtn');
    if (headerSaveBtn) headerSaveBtn.addEventListener('click', saveSettings);

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveSettings);

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetSettings);

    updateChannelCounts();
}

function updateChannelCounts() {
    const counts = { push: 0, sms: 0, email: 0, kakao: 0 };
    document.querySelectorAll('.ch-btn.on').forEach(btn => {
        if (btn.classList.contains('push')) counts.push++;
        if (btn.classList.contains('sms')) counts.sms++;
        if (btn.classList.contains('email')) counts.email++;
        if (btn.classList.contains('kakao')) counts.kakao++;
    });
    const p = document.getElementById('pushCount');
    const s = document.getElementById('smsCount');
    const e = document.getElementById('emailCount');
    const k = document.getElementById('kakaoCount');
    if (p) p.textContent = counts.push;
    if (s) s.textContent = counts.sms;
    if (e) e.textContent = counts.email;
    if (k) k.textContent = counts.kakao;
}

function markUnsaved() {
    const b1 = document.getElementById('unsavedBadge');
    const b2 = document.getElementById('unsavedBadge2');
    if (b1) b1.classList.add('show');
    if (b2) b2.classList.add('show');
}

function saveSettings() {
    const b1 = document.getElementById('unsavedBadge');
    const b2 = document.getElementById('unsavedBadge2');
    if (b1) b1.classList.remove('show');
    if (b2) b2.classList.remove('show');
    toast('알림 설정이 저장됐습니다! 🎉', '💾');
}

function resetSettings() {
    if (!confirm('알림 설정을 기본값으로 초기화하시겠어요?')) return;
    toast('설정이 초기화됐습니다', '↩️');
    markUnsaved();
}

function readItem(id) {
    const item = document.getElementById(id);
    if (!item) return;
    const num = id.replace('ni', '');
    const dot = document.getElementById('nd' + num);
    const title = document.getElementById('nt' + num);
    
    item.classList.remove('unread');
    if (dot) dot.classList.add('read');
    if (title) title.classList.add('read');
    toast('알림을 읽음 처리했습니다', '✓');
}

function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(item => {
        const num = item.id.replace('ni', '');
        const dot = document.getElementById('nd' + num);
        const title = document.getElementById('nt' + num);
        item.classList.remove('unread');
        if (dot) dot.classList.add('read');
        if (title) title.classList.add('read');
    });
    toast('모든 알림을 읽음 처리했습니다 ✓', '✓');
}

let toastTimer;
function toast(msg, icon = '✅') {
    clearTimeout(toastTimer);
    const toastEl = document.getElementById('toastEl');
    const msgEl = document.getElementById('toastMsg');
    const iconEl = document.getElementById('toastIcon');

    if (msgEl) msgEl.textContent = msg;
    if (iconEl) iconEl.textContent = icon;
    if (toastEl) {
        toastEl.classList.add('show');
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
    }
}

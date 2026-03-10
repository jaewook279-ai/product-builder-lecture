/* ─── 관리자(C) 고도화 JS ─── */

document.addEventListener('DOMContentLoaded', () => {
  initAdminCommon();
  if (document.getElementById('revenueChart')) initDashboardCharts();
  initSimulationHandlers();
});

// 1. 공통 초기화
function initAdminCommon() {
  // 사이드바 토글
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  
  hamburgerBtn?.addEventListener('click', () => {
    sidebar?.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.style.display = 'block';
  });

  sidebarOverlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    sidebarOverlay.style.display = 'none';
  });

  // 탭 전환
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const container = btn.closest('.content') || document.body;
      btn.closest('.tab-nav').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      container.querySelectorAll('[data-tab-content]').forEach(c => {
        c.style.display = c.dataset.tabContent === btn.dataset.tab ? 'block' : 'none';
      });
    });
  });
}

// 2. 대시보드 차트 및 라이브 데이터 시뮬레이션
function initDashboardCharts() {
  const months = ['1월','2월','3월'];
  const vals   = [7200, 7800, 9200];
  const max = Math.max(...vals);
  const chart = document.getElementById('revenueChart');
  
  if (chart) {
    chart.innerHTML = '';
    months.forEach((m,i) => {
      const g = document.createElement('div'); g.className = 'bar-group';
      const pct = (vals[i]/max*100);
      g.innerHTML = `
        <div class="bar-val">${(vals[i]/100).toFixed(0)}만</div>
        <div class="bar-fill${i===2?' current':''}" style="height:0%; transition:height 1s ease;"></div>
        <div class="bar-label">${m}</div>
      `;
      chart.appendChild(g);
      setTimeout(() => {
        g.querySelector('.bar-fill').style.height = pct + '%';
      }, 100 * (i + 1));
    });
  }

  // 라이브 KPI 업데이트 시뮬레이션 (조금씩 숫자가 올라감)
  setInterval(() => {
    const mau = document.querySelector('.kpi-card.blue .kpi-value');
    if (mau) {
      let val = parseInt(mau.textContent.replace(/,/g, ''));
      if (Math.random() > 0.7) {
        val += 1;
        mau.textContent = val.toLocaleString();
      }
    }
  }, 3000);
}

// 3. 관리 기능 시뮬레이션 핸들러
function initSimulationHandlers() {
  // 전문가 심사 승인/반려
  const reviewActions = document.querySelectorAll('#reviewPanel .btn');
  reviewActions.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeItem = document.querySelector('.applicant-item.active');
      if (!activeItem) return;

      const actionText = btn.textContent.trim();
      if (actionText.includes('승인')) {
        showToast(`✅ ${activeItem.querySelector('div div').textContent} 전문가 승인 완료!`);
        removeApplicant(activeItem);
      } else if (actionText.includes('반려')) {
        showToast(`❌ 반려 처리되었습니다.`);
        removeApplicant(activeItem);
      }
    });
  });

  // 정산 처리
  document.querySelectorAll('.data-table .btn-primary').forEach(btn => {
    if (btn.textContent.includes('정산')) {
      btn.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const name = row.querySelector('div div').textContent;
        const amount = row.querySelectorAll('td')[5].textContent;
        
        row.style.opacity = '0.5';
        row.querySelector('.badge-amber').className = 'badge badge-green';
        row.querySelector('.badge-green').textContent = '✓ 정산완료';
        e.target.disabled = true;
        e.target.textContent = '완료';
        
        showToast(`💰 ${name}님께 ${amount} 정산 입금이 완료되었습니다.`);
      });
    }
  });
}

// 전문가 목록에서 항목 제거 (심사 완료 시)
function removeApplicant(el) {
  el.style.transform = 'translateX(100px)';
  el.style.opacity = '0';
  setTimeout(() => {
    el.remove();
    // 다음 항목 자동 선택 시뮬레이션
    const next = document.querySelector('.applicant-item');
    if (next) next.click();
    else {
      const list = document.getElementById('applicantList');
      if (list) list.innerHTML = '<div class="empty">심사 대기 건이 없습니다.</div>';
    }
  }, 300);
}

// 환불 계산 모달
function openRefundModal(name, totalAmount) {
  const modal = document.getElementById('refundModal');
  const target = document.getElementById('refundTarget');
  if (modal && target) {
    target.textContent = `${name} 회원의 부분 환불 금액을 계산합니다.`;
    modal.classList.add('open');
    
    // 계산 시뮬레이션
    const refundInput = modal.querySelector('input[type=number]');
    if (refundInput) {
      const calculated = Math.floor(totalAmount * 0.72); // 예시 계산
      refundInput.value = calculated;
    }
  }
}

function showToast(msg, duration = 2800) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.className = 'show';
  setTimeout(() => { t.className = ''; }, duration);
}

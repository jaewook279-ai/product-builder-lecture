document.addEventListener('DOMContentLoaded', () => {
    initReviewPage();
});

const starLabels = ['', '별로였어요 😞', '아쉬웠어요 😐', '보통이에요 🙂', '좋았어요 😊', '아주 훌륭해요! 😊'];
let mainRating = 5;

function initReviewPage() {
    // Main Rating Stars
    const mainStars = document.querySelectorAll('#mainStars .star');
    mainStars.forEach(star => {
        star.addEventListener('click', () => {
            mainRating = parseInt(star.getAttribute('data-index'));
            mainStars.forEach((s, i) => {
                s.classList.toggle('active', i < mainRating);
            });
            const labelEl = document.getElementById('starLabel');
            if (labelEl) labelEl.textContent = starLabels[mainRating];
        });
    });

    // Aspect Stars
    const aspectGroups = ['asp1', 'asp2', 'asp3', 'asp4'];
    aspectGroups.forEach(groupId => {
        const stars = document.querySelectorAll(`#${groupId} .asp-star`);
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const rating = parseInt(star.getAttribute('data-index'));
                stars.forEach((s, i) => {
                    s.classList.toggle('active', i < rating);
                });
            });
        });
    });

    // Keyword Buttons
    const kwBtns = document.querySelectorAll('.kw-btn');
    kwBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    // Character Count
    const reviewText = document.getElementById('reviewText');
    const charCount = document.getElementById('charCount');
    if (reviewText && charCount) {
        reviewText.addEventListener('input', () => {
            const len = reviewText.value.length;
            charCount.textContent = `${len} / 300자`;
        });
    }

    // Submit Review
    const submitBtn = document.getElementById('submitReviewBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            toast('리뷰가 등록됐습니다! 감사합니다 ⭐');
            setTimeout(() => {
                window.location.href = 'matching.html'; // Or dashboard
            }, 1600);
        });
    }

    // Skip Button
    const skipBtn = document.getElementById('skipBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            window.location.href = 'matching.html';
        });
    }
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
        }, 3000);
    }
}

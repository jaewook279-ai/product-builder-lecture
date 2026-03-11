// GNB Scroll Effect
const gnb = document.getElementById('gnb');
window.addEventListener('scroll', () => {
    if (gnb) {
        gnb.classList.toggle('scrolled', window.scrollY > 10);
    }
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.mobile-menu a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });
}

// Reveal Animations on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, 80);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Number Count Up Animation
function animateCount(el, target, suffix = '+') {
    const duration = 2000;
    const start = performance.now();
    
    const update = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    requestAnimationFrame(update);
}

const statsEl = document.querySelector('.hero-stats');
if (statsEl) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('[data-count]').forEach(el => {
                    const countStr = el.getAttribute('data-count').replace(/[^0-9]/g, '');
                    const target = parseInt(countStr);
                    const suffix = el.getAttribute('data-count').replace(/[0-9,]/g, '');
                    animateCount(el, target, suffix);
                });
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsEl);
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isOpen = item.classList.contains('open');
        
        // Close other open items
        document.querySelectorAll('.faq-item.open').forEach(i => {
            if (i !== item) i.classList.remove('open');
        });
        
        item.classList.toggle('open', !isOpen);
        
        const span = question.querySelector('span');
        if (span) {
            span.textContent = item.classList.contains('open') ? '−' : '+';
        }
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

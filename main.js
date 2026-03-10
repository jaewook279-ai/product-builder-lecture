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
    const duration = 1800;
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
                    const target = parseInt(el.getAttribute('data-count'));
                    animateCount(el, target);
                });
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    statsObserver.observe(statsEl);
}

// FAQ Accordion
document.querySelectorAll('.faq-q').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isOpen = item.classList.contains('open');
        
        // Close other open items
        document.querySelectorAll('.faq-item.open').forEach(i => {
            if (i !== item) i.classList.remove('open');
        });
        
        item.classList.toggle('open', !isOpen);
    });
});

// Pricing Toggle (Monthly/Yearly)
let isYearly = false;
const toggleSwitch = document.getElementById('toggleSwitch');
const monthlyLabel = document.getElementById('monthlyLabel');
const yearlyLabel = document.getElementById('yearlyLabel');
const saveBadge = document.getElementById('saveBadge');

const prices = {
    monthly: [29900, 59900, 99900],
    yearly: [24900, 49900, 82900]
};

if (toggleSwitch) {
    toggleSwitch.addEventListener('click', () => {
        isYearly = !isYearly;
        
        toggleSwitch.classList.toggle('yearly', isYearly);
        monthlyLabel.classList.toggle('active', !isYearly);
        yearlyLabel.classList.toggle('active', isYearly);
        
        if (saveBadge) {
            saveBadge.style.display = isYearly ? 'inline-flex' : 'none';
        }
        
        const currentPrices = isYearly ? prices.yearly : prices.monthly;
        ['price1', 'price2', 'price3'].forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = currentPrices[i].toLocaleString();
            }
        });
    });
}

// Expert Fields Filtering
function filterFields(cat, btn) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Filter cards
    document.querySelectorAll('.field-card').forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeUp 0.35s ease both';
        } else {
            card.classList.add('hidden');
        }
    });
}

// Attach filter listeners
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter');
        filterFields(category, btn);
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

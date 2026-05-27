const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.addEventListener('mousemove', (e) => {
    const blobs = document.querySelectorAll('.floating-blob');
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    if (blobs[0]) blobs[0].style.transform = `translate(${x * 100}px, ${y * 100}px)`;
    if (blobs[1]) blobs[1].style.transform = `translate(${x * -80}px, ${y * -80}px)`;
});

// Project modal logic
const modal = document.getElementById('project-modal');
const modalContent = document.getElementById('project-modal-content');
const templates = document.getElementById('project-templates');

function openProjectModal(id) {
    const tmpl = templates.querySelector('#tmpl-' + id);
    if (!tmpl) return;
    modalContent.innerHTML = tmpl.innerHTML;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    modalContent.innerHTML = '';
    document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-project]');
    if (card) {
        const id = card.getAttribute('data-project');
        openProjectModal(id.padStart(2, '0'));
    }
    if (e.target.matches('#modal-close') || e.target.dataset.modalClose !== undefined) {
        closeProjectModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeProjectModal();
});

// Certifications carousel controls
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.cert-carousel');
    const btnPrev = document.querySelector('.cert-prev');
    const btnNext = document.querySelector('.cert-next');
    if (!carousel) return;
    const scrollAmount = () => Math.round(carousel.clientWidth * 0.6);
    if (btnPrev) btnPrev.addEventListener('click', () => { carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); });
    if (btnNext) btnNext.addEventListener('click', () => { carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); });
});

// Certifications autoplay slider
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.cert-carousel');
    if (!carousel) return;
    let autoplayInterval = null;
    const cards = carousel.querySelectorAll('.cert-card');
    const cardWidth = () => (cards[0] ? cards[0].getBoundingClientRect().width + parseInt(getComputedStyle(cards[0]).marginRight || 0) : 300);
    const startAutoplay = () => {
        if (autoplayInterval) return;
        autoplayInterval = setInterval(() => {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            if (Math.abs(carousel.scrollLeft - maxScroll) < 10) {
                carousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carousel.scrollBy({ left: cardWidth(), behavior: 'smooth' });
            }
        }, 3000);
    };
    const stopAutoplay = () => {
        if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; }
    };
    // start
    startAutoplay();
    // pause on hover/focus
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);
});

// Theme toggle (light mode)
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    const toggleIcon = document.getElementById('theme-toggle-icon');
    const heroRobotImg = document.getElementById('hero-robot-img');
    if (!toggleBtn || !toggleIcon) return;

    const applyTheme = (isLight) => {
        root.classList.toggle('light-mode', isLight);
        toggleIcon.textContent = isLight ? 'dark_mode' : 'light_mode';
        toggleBtn.setAttribute('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
        if (heroRobotImg) {
            heroRobotImg.src = isLight ? 'img/robotblanco.png' : 'img/robotoscuro.png';
        }
    };

    const saved = localStorage.getItem('theme-mode');
    applyTheme(saved === 'light');

    toggleBtn.addEventListener('click', () => {
        const isLight = !root.classList.contains('light-mode');
        applyTheme(isLight);
        localStorage.setItem('theme-mode', isLight ? 'light' : 'dark');
    });
});
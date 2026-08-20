const navToggle = document.querySelector('.nav-toggle');
const havenNav = document.querySelector('.haven-nav');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');

navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    havenNav.classList.toggle('is-open', !open);
});

havenNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navToggle.setAttribute('aria-expanded', 'false');
    havenNav.classList.remove('is-open');
}));

document.querySelectorAll('.gallery-card').forEach((card) => card.addEventListener('click', () => {
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = card.querySelector('img').alt;
    lightboxCaption.textContent = card.dataset.title;
    lightbox.showModal();
}));

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
document.querySelector('#year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.haven-section, .scene-grid article, .gallery-card, .media-card').forEach((element) => observer.observe(element));

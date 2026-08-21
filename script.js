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

document.querySelectorAll('.gallery-card, .favorite-frame').forEach((card) => card.addEventListener('click', () => {
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = card.querySelector('img').alt;
    lightboxCaption.textContent = card.dataset.title;
    lightbox.showModal();
}));

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
document.querySelector('#year').textContent = new Date().getFullYear();

const observationDialog = document.querySelector('.observation-dialog');
document.querySelector('.observation-trigger').addEventListener('click', () => observationDialog.showModal());
observationDialog.querySelector('.observation-close').addEventListener('click', () => observationDialog.close());
observationDialog.addEventListener('click', (event) => { if (event.target === observationDialog) observationDialog.close(); });

const soundtrackToggle = document.querySelector('#soundtrack-toggle');
const trackTitle = document.querySelector('#track-title');
const trackArtist = document.querySelector('#track-artist');
const progressBar = document.querySelector('#progress-bar');
const tracks = [
    { title: 'MEPHISTO', artist: 'QUEEN BEE / LOCAL REEL' },
    { title: 'BLUE HOUR STUDY', artist: 'AKANE HAVEN / AMBIENT REEL' }
];
let selectedTrack = 0;
let soundtrackPlaying = false;

const setTrack = (trackIndex) => {
    selectedTrack = trackIndex;
    trackTitle.textContent = tracks[trackIndex].title;
    trackArtist.textContent = tracks[trackIndex].artist;
    document.querySelectorAll('.track-button').forEach((button, index) => button.classList.toggle('is-active', index === trackIndex));
    document.documentElement.style.setProperty('--accent-shift', trackIndex === 0 ? '134,205,209' : '105,124,169');
};

document.querySelectorAll('.track-button').forEach((button) => button.addEventListener('click', () => setTrack(Number(button.dataset.track))));
soundtrackToggle.addEventListener('click', () => {
    soundtrackPlaying = !soundtrackPlaying;
    soundtrackToggle.textContent = soundtrackPlaying ? 'PAUSE' : 'PLAY';
    soundtrackToggle.classList.toggle('is-playing', soundtrackPlaying);
    soundtrackToggle.setAttribute('aria-pressed', String(soundtrackPlaying));
    progressBar.style.width = soundtrackPlaying ? '62%' : '18%';
    document.body.classList.toggle('soundtrack-active', soundtrackPlaying);
});
setTrack(0);

const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            instance.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.haven-section, .scene-grid article, .gallery-card, .favorite-frame, .media-card').forEach((element) => observer.observe(element));

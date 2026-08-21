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
const soundtrackEmbed = document.querySelector('#soundtrack-embed');
const soundtrackCover = document.querySelector('.soundtrack-cover');
const coverIndex = document.querySelector('#cover-index');
const coverKicker = document.querySelector('#cover-kicker');
const tracks = [
    { title: 'MEPHISTO', artist: 'QUEEN BEE / LOCAL REEL', label: 'REEL', embed: '' },
    { title: 'BLUE HOUR STUDY', artist: 'AKANE HAVEN / AMBIENT REEL', label: 'SONG', embed: 'https://open.spotify.com/embed/track/4CXTnisQPu4vcyfbmxnKEx?utm_source=generator' }
];
let selectedTrack = 0;
let soundtrackPlaying = false;

const renderSoundtrackEmbed = () => {
    const activeTrack = tracks[selectedTrack];

    if (activeTrack.embed) {
        const autoplay = soundtrackPlaying ? '&autoplay=true' : '';
        soundtrackEmbed.innerHTML = `
            <iframe
                src="${activeTrack.embed}${autoplay}"
                title="Akane Haven soundtrack track"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
        return;
    }

    soundtrackEmbed.innerHTML = '<div class="soundtrack-embed-placeholder">LOCAL REEL / TRACK 01</div>';
};

const setTrack = (trackIndex) => {
    selectedTrack = trackIndex;
    trackTitle.textContent = tracks[trackIndex].title;
    trackArtist.textContent = tracks[trackIndex].artist;
    coverKicker.textContent = tracks[trackIndex].label;
    coverIndex.textContent = String(trackIndex + 1).padStart(2, '0');
    soundtrackCover.classList.toggle('soundtrack-cover--song', trackIndex === 1);
    document.querySelectorAll('.track-button').forEach((button, index) => button.classList.toggle('is-active', index === trackIndex));
    document.documentElement.style.setProperty('--accent-shift', trackIndex === 0 ? '134,205,209' : '105,124,169');
    renderSoundtrackEmbed();
};

document.querySelectorAll('.track-button').forEach((button) => button.addEventListener('click', () => setTrack(Number(button.dataset.track))));
soundtrackToggle.addEventListener('click', () => {
    soundtrackPlaying = !soundtrackPlaying;
    soundtrackToggle.textContent = soundtrackPlaying ? 'PAUSE' : 'PLAY';
    soundtrackToggle.classList.toggle('is-playing', soundtrackPlaying);
    soundtrackToggle.setAttribute('aria-pressed', String(soundtrackPlaying));
    progressBar.style.width = soundtrackPlaying ? '62%' : '18%';
    document.body.classList.toggle('soundtrack-active', soundtrackPlaying);
    renderSoundtrackEmbed();
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

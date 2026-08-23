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
const progressTrack = document.querySelector('.progress-track');
const soundtrackAudio = document.querySelector('#soundtrack-audio');
const soundtrackEmbed = document.querySelector('#soundtrack-embed');
const soundtrackCover = document.querySelector('#soundtrack-cover');
const coverIndex = document.querySelector('#cover-index');
const coverKicker = document.querySelector('#cover-kicker');
const tracks = [
    { title: 'MEPHISTO', artist: 'QUEEN BEE / LOCAL REEL', label: 'REEL', src: 'media/mephisto.mp3', cover: 'images/mephisto.jpg' },
    { title: 'TEST ME', artist: 'AKANE HAVEN / AMBIENT REEL', label: 'SONG', src: 'media/test-me.mp3', cover: 'images/test-me.jpg' }
];
let selectedTrack = 0;
let soundtrackPlaying = false;

const updatePlaybackUi = () => {
    const hasDuration = Number.isFinite(soundtrackAudio.duration) && soundtrackAudio.duration > 0;
    const progress = hasDuration ? (soundtrackAudio.currentTime / soundtrackAudio.duration) * 100 : 0;

    progressBar.style.width = `${progress}%`;
    progressTrack.setAttribute('aria-valuenow', String(Math.round(progress)));
    soundtrackToggle.textContent = soundtrackPlaying ? 'PAUSE' : 'PLAY';
    soundtrackToggle.classList.toggle('is-playing', soundtrackPlaying);
    soundtrackToggle.setAttribute('aria-pressed', String(soundtrackPlaying));
    document.body.classList.toggle('soundtrack-active', soundtrackPlaying);
};

const renderSoundtrackSource = () => {
    soundtrackEmbed.innerHTML = `<div class="soundtrack-embed-placeholder">LOCAL REEL / TRACK ${String(selectedTrack + 1).padStart(2, '0')}</div>`;
};

const setTrack = async (trackIndex) => {
    const shouldResume = soundtrackPlaying;
    selectedTrack = trackIndex;
    soundtrackPlaying = false;
    soundtrackAudio.pause();
    soundtrackAudio.src = tracks[trackIndex].src;
    soundtrackAudio.load();
    soundtrackCover.src = tracks[trackIndex].cover;
    soundtrackCover.alt = `${tracks[trackIndex].title} album artwork`;
    trackTitle.textContent = tracks[trackIndex].title;
    trackArtist.textContent = tracks[trackIndex].artist;
    coverKicker.textContent = tracks[trackIndex].label;
    coverIndex.textContent = String(trackIndex + 1).padStart(2, '0');
    soundtrackCover.classList.toggle('soundtrack-cover--song', trackIndex === 1);
    document.querySelectorAll('.track-button').forEach((button, index) => button.classList.toggle('is-active', index === trackIndex));
    document.documentElement.style.setProperty('--accent-shift', trackIndex === 0 ? '134,205,209' : '105,124,169');
    renderSoundtrackSource();
    updatePlaybackUi();

    if (shouldResume) {
        try {
            await soundtrackAudio.play();
            soundtrackPlaying = true;
            updatePlaybackUi();
        } catch (error) {
            soundtrackPlaying = false;
            updatePlaybackUi();
        }
    }
};

document.querySelectorAll('.track-button').forEach((button) => button.addEventListener('click', () => setTrack(Number(button.dataset.track))));
soundtrackToggle.addEventListener('click', async () => {
    if (soundtrackPlaying) {
        soundtrackAudio.pause();
        soundtrackPlaying = false;
        updatePlaybackUi();
        return;
    }

    try {
        await soundtrackAudio.play();
        soundtrackPlaying = true;
        updatePlaybackUi();
    } catch (error) {
        soundtrackPlaying = false;
        soundtrackEmbed.innerHTML = '<div class="soundtrack-embed-placeholder">ADD THE LOCAL AUDIO FILE TO PLAY</div>';
        updatePlaybackUi();
    }
});
progressTrack.addEventListener('click', (event) => {
    if (!Number.isFinite(soundtrackAudio.duration) || soundtrackAudio.duration <= 0) return;
    const bounds = progressTrack.getBoundingClientRect();
    soundtrackAudio.currentTime = ((event.clientX - bounds.left) / bounds.width) * soundtrackAudio.duration;
});
soundtrackAudio.addEventListener('timeupdate', updatePlaybackUi);
soundtrackAudio.addEventListener('loadedmetadata', updatePlaybackUi);
soundtrackAudio.addEventListener('ended', () => {
    soundtrackPlaying = false;
    updatePlaybackUi();
});
soundtrackAudio.addEventListener('error', () => {
    soundtrackPlaying = false;
    soundtrackEmbed.innerHTML = '<div class="soundtrack-embed-placeholder">AUDIO FILE UNAVAILABLE</div>';
    updatePlaybackUi();
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

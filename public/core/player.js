const audio = document.getElementById('audio-player');
const currentMusicPlayed = document.querySelector('.player-music-name .music-name-content');
const playPauseBtn = document.querySelector('.player-play-pause');
const playBtn = document.querySelector('.player-play');
const pauseBtn = document.querySelector('.player-pause');
const progressBar = document.querySelector('.player-progress-bar');
const volumeControl = document.querySelector('.player-volume');
const randomBtn = document.querySelector('.player-random-btn');
const loopBtn = document.querySelector('.player-loop-btn');

function updateCurrentMusicDisplay() {
    const currentSrc = decodeURIComponent(audio.src);
    const musicItems = document.querySelectorAll('.player-container-list .music-item');

    musicItems.forEach(item => {
        const dataPath = item.getAttribute('data-path');
        const normalizedPath = dataPath.replace(/\\/g, '/');

        if (currentSrc.includes(normalizedPath)) {
            const title = item.querySelector('.music-title')?.textContent || 'Musique inconnue';
            const span = document.querySelector('.music-title-content'); // élément cible

            if (span) {
                span.textContent = title;

                // Stopper animation précédente
                span.style.animation = 'none';

                // Forcer recalcul layout pour reset animation
                void span.offsetWidth;

                // Calcul dynamique durée + distance
                const containerWidth = span.parentElement.offsetWidth;
                const textWidth = span.scrollWidth;
                const distance = textWidth + containerWidth;

                // Variable CSS pour animation
                span.style.setProperty('--scroll-distance', `${distance}px`);

                // Calcul durée (exemple ratio 5s / 100px)
                const duration = (distance / 100) * 2;

                // Appliquer animation avec durée dynamique
                span.style.animation = `scrollText ${duration}s linear infinite`;
            }

            // Gestion classes d’opacité sur éléments décoratifs
            document.querySelectorAll(".music-title-part").forEach(el => {
                el.classList.add("music-title-part-active");
                el.classList.remove("music-title-part-disabled");
            });
        }
    });
}

audio.addEventListener('play', () => {
    updateCurrentMusicDisplay();
});

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
    } else {
        audio.pause();
        playPauseBtn.classList.remove('pause');
        playPauseBtn.classList.add('play');
    }
});

progressBar.parentElement.addEventListener('click', (e) => {
    const rect = progressBar.parentElement.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

const volumeSlider = document.createElement('input');
volumeSlider.type = 'range';
volumeSlider.min = 0;
volumeSlider.max = 1;
volumeSlider.step = 0.01;
volumeSlider.value = audio.volume;

volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

document.querySelector('.player-volume').appendChild(volumeSlider);


let loopState = 'none'; // none, all, one

loopBtn.addEventListener('click', () => {
    if (loopState === 'none') {
        loopState = 'all';
        loopBtn.className = 'loop-all';
    } else if (loopState === 'all') {
        loopState = 'one';
        loopBtn.className = 'loop-one';
        audio.loop = true;
    } else {
        loopState = 'none';
        loopBtn.className = '';
        audio.loop = false;
    }
});

audio.addEventListener('ended', () => {
    if (loopState === 'one') {
        audio.play();
    } else if (loopState === 'all' || isRandomEnabled) {
        playNextRandomTrack();
    }
});

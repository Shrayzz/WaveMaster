const audio = document.getElementById('audio-player');
const currentMusicPlayed = document.querySelector('.player-music-name .music-name-content');
const playPauseBtn = document.querySelector('.player-play-pause');
const playBtn = document.querySelector('.player-play');
const pauseBtn = document.querySelector('.player-pause');
const progressBar = document.querySelector('.player-progress-bar');
const progressFill = document.querySelector('.player-progress-fill');
const progressThumb = document.querySelector('.player-progress-thumb');
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
                span.style.animation = 'none';
                void span.offsetWidth;

                const containerWidth = span.parentElement.offsetWidth;
                const textWidth = span.scrollWidth;
                const distance = textWidth + containerWidth;

                span.style.setProperty('--scroll-distance', `${distance}px`);

                const duration = (distance / 100) * 2;

                span.style.animation = `scrollText ${duration}s linear infinite`;
            }

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

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${percent}%`;
    progressThumb.style.left = `${percent}%`;

    const currentTimeSpan = document.querySelector('.player-read-current-duration');
    const totalTimeSpan = document.querySelector('.player-read-total-duration');

    if (currentTimeSpan && totalTimeSpan) {
        currentTimeSpan.textContent = formatTime(audio.currentTime);
        totalTimeSpan.textContent = formatTime(audio.duration || 0);
    }
});
let isDragging = false;

progressBar.parentElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateProgress(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateProgress(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

function updateProgress(e) {
    const rect = progressBar.parentElement.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    audio.currentTime = percent * audio.duration;
}
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

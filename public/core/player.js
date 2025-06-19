const audio = document.getElementById('audio-player');
const currentMusicPlayed = document.querySelector('.player-music-name .music-name-content');
const playPauseBtn = document.querySelector('.player-play-pause');
const playBtn = document.querySelector('.player-play');
const pauseBtn = document.querySelector('.player-pause');
const progressBar = document.querySelector('.player-progress-bar');
const progressFill = document.querySelector('.player-progress-fill');
const progressThumb = document.querySelector('.player-progress-thumb');
const volumeControl = document.querySelector('.player-volume-slider');
const volumeFill = document.querySelector('.player-volume-fill');
const volumeImg = document.querySelector('.player-volume');
const volumeThumb = document.querySelector('.player-volume-thumb');
const volumeValue = document.querySelector('.player-volume-value');
const volumeMute = document.querySelector('.player-volume-mute');
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

function updateVolumeIcon() {
    const volumePercent = audio.volume * 100;

    volumeImg.classList.remove("player-volume-100", "player-volume-50", "player-volume-0");

    if (audio.muted || audio.volume === 0) {
        volumeImg.classList.add("player-volume-0");
    } else if (volumePercent <= 50) {
        volumeImg.classList.add("player-volume-50");
    } else {
        volumeImg.classList.add("player-volume-100");
    }
}

function setVolume(clientY) {
    const rect = volumeControl.getBoundingClientRect();
    let percent = 1 - (clientY - rect.top) / rect.height;
    percent = Math.max(0, Math.min(1, percent));
    audio.volume = percent;

    volumeFill.style.height = `${percent * 100}%`;
    volumeThumb.style.top = `${(1 - percent) * 100}%`;
}

volumeControl.addEventListener('mousedown', (e) => {
    setVolume(e.clientY);
    previousVolume = audio.volume;
    volumeValue.textContent = Number(audio.volume * 100).toFixed(0);
    isVolumeDragging = true;
});

let isVolumeDragging = false;

document.addEventListener('mousemove', (e) => {
    if (isVolumeDragging) {
        setVolume(e.clientY);
        volumeValue.textContent = Number(audio.volume * 100).toFixed(0);

        if (!audio.muted) {
            previousVolume = audio.volume; 
        }
    }
});

document.addEventListener('mouseup', () => {
    isVolumeDragging = false;
});

function setInitialVolume() {
    const percent = audio.volume;
    volumeFill.style.height = `${percent * 100}%`;
    volumeThumb.style.top = `${(1 - percent) * 100}%`;
}

audio.addEventListener('volumechange', setInitialVolume);
setInitialVolume();

let previousVolume = audio.volume;

volumeMute.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = previousVolume > 0 ? previousVolume : 0.5;

        volumeValue.textContent = Number(audio.volume * 100).toFixed(0);

        volumeMute.classList.remove('mute');
        volumeMute.classList.add('demute');
    } else {
        previousVolume = audio.volume;
        audio.muted = true;
        audio.volume = 0;

        volumeValue.textContent = "Muted";

        volumeMute.classList.remove('demute');
        volumeMute.classList.add('mute');
    }

    setInitialVolume();
});

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

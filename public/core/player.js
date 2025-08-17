const audio = document.getElementById('audio-player');
const borders = document.querySelectorAll('.music-title-borders')
const playPauseBtn = document.querySelector('.player-play-pause');
const prevBtn = document.querySelector('.player-skip-back')
const nextBtn = document.querySelector('.player-skip-forward')
const progressBar = document.querySelector('.player-progress-bar');
const progressFill = document.querySelector('.player-progress-fill');
const progressThumb = document.querySelector('.player-progress-thumb');
const volumeControl = document.querySelector('.player-volume-slider');
const volumeFill = document.querySelector('.player-volume-fill');
const volumeImg = document.getElementById('player-volume');
const volumeThumb = document.querySelector('.player-volume-thumb');
const volumeValue = document.querySelector('.player-volume-value');
const volumeMute = document.querySelector('.player-volume-mute');
const shuffleBtn = document.getElementById('player-random-btn');
const loopBtn = document.getElementById('player-loop-btn');

const globalValues = await window.wmAPI.getGlobalValues();

// Music played
export function updateCurrentMusicDisplay() {
    const currentSrc = decodeURIComponent(audio.src);

    globalValues.musicItems.forEach(item => {
        const dataPath = item.getAttribute('data-path');
        const normalizedPath = dataPath.replace(/\\/g, '/');

        if (currentSrc.includes(normalizedPath)) {
            const title = item.querySelector('.music-title')?.textContent || 'Musique inconnue';
            console.log("Titre choisi :", title);
            const span = document.querySelector('.music-title-content');

            if (span) {
                span.textContent = title;
                span.style.animation = 'none';
                void span.offsetWidth;

                requestAnimationFrame(() => {
                    const containerWidth = span.parentElement.offsetWidth;
                    const textWidth = span.scrollWidth;

                    const shouldScroll = textWidth > containerWidth;

                    if (shouldScroll) {
                        const distance = textWidth + containerWidth;
                        span.style.setProperty('--scroll-distance', `${distance}px`);

                        const duration = (distance / 100) * 1.5;
                        span.style.left = '100%';
                        span.style.transform = '';
                        borders.forEach(border => {
                            border.style.display = 'block';
                        });
                        span.style.animation = `scrollText ${duration}s linear infinite`;
                    } else {
                        borders.forEach(border => {
                            border.style.display = 'none';
                        });
                        span.style.left = '0%';
                        span.style.animation = 'none';
                    }
                });
            }

            document.querySelectorAll(".music-title-part").forEach(el => {
                el.classList.add("music-title-part-active");
                el.classList.remove("music-title-part-disabled");
            });
        }
    });
}

// Player
audio.addEventListener('play', () => {
    updateCurrentMusicDisplay();
    updatePlayPauseIcon();
});


function updatePlayPauseIcon() {
    if (audio.paused) {
        playPauseBtn.classList.remove('pause');
        playPauseBtn.classList.add('play');
    } else {
        playPauseBtn.classList.remove('play');
        playPauseBtn.classList.add('pause');
    }
}

playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayPauseIcon();
});

// Progress bar

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
    audio.pause();
    updateProgress(e);
});
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        updateProgress(e);
    }
});
document.addEventListener('mouseup', () => {
    isDragging = false;
    audio.play();
});

function updateProgress(e) {
    const rect = progressBar.parentElement.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    audio.currentTime = percent * audio.duration;
}

// Volume

function updateVolumeIcon() {
    const volumePercent = audio.volume * 100;

    volumeImg.classList.remove("player-volume-100", "player-volume-50", "player-volume-0");

    console.log("Audio changed :", parseInt(audio.volume * 100));
    if (audio.muted || audio.volume === 0) {
        volumeImg.classList.add("player-volume-0");
    } else if (volumePercent <= 50) {
        volumeImg.classList.add("player-volume-50");
    } else {
        volumeImg.classList.add("player-volume-100");
    }
    console.log("Added class :", volumeImg.className);
}
audio.addEventListener('volumechange', updateVolumeIcon);

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

// Backward and forward track

nextBtn.addEventListener('click', () => {
    if (globalValues.currentTrackIndex < globalValues.musicList.length - 1) {
        globalValues.currentTrackIndex++;
        playTrackByIndex(globalValues.currentTrackIndex);
    }
});

prevBtn.addEventListener('click', () => {
    if (globalValues.currentTrackIndex > 0) {
        globalValues.currentTrackIndex--;
        playTrackByIndex(globalValues.currentTrackIndex);
    }
});

function playTrackByIndex(index) {
    const music = globalValues.musicList[index];
    if (!music) return;

    const path = music.path;
    audio.src = path;
    audio.play();
}

// Loops and shuffle

loopBtn.addEventListener('click', () => {
    loopBtn.classList.remove('repeat-all', 'repeat-one', 'no-repeat');

    if (globalValues.loopState === 'none') {
        globalValues.loopState = 'all';
        loopBtn.classList.add('repeat-all');
        audio.loop = false; 
    } else if (globalValues.loopState === 'all') {
        globalValues.loopState = 'one';
        loopBtn.classList.add('repeat-one');
        audio.loop = true;
    } else {
        globalValues.loopState = 'none';
        loopBtn.classList.add('no-repeat');
        audio.loop = false;
    }
});

shuffleBtn.addEventListener('click', () => {
    shuffleBtn.classList.remove('shuffle', 'no-shuffle');

    if (globalValues.shuffleState === false) {
        globalValues.shuffleState = true;
        shuffleBtn.classList.add('shuffle');
    } else {
        globalValues.shuffleState = false;
        shuffleBtn.classList.add('no-shuffle');
    }
});

audio.onended = () => {
    const loopState = globalValues.loopState;
    const shuffleState = globalValues.shuffleState;

    if (shuffleState === true) {
        const result = Math.floor(Math.random() * globalValues.musicList.length);
        console.log("Random track selected :", result);

        globalValues.currentTrackIndex = result;
        playTrackByIndex(result);
    } else if (loopState === 'all') {
        const list = globalValues.musicList.length;
        let index = globalValues.currentTrackIndex;

        index = (index + 1) % list;

        globalValues.currentTrackIndex = index;
        playTrackByIndex(index);
    }
};

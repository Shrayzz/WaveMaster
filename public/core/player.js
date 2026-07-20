import { setDisplayWithAnim } from "./animation.js";
import { playTrackByIndex } from "./event.js";

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

import { globalValues } from "../../backend/data/values.js";
let randValue = '';

// Music played
export async function updateCurrentMusicDisplay(index) {

    const title = document
    .querySelector(`[data-index="${index}"]`)
    .querySelector('.music-title')
    .textContent;

    const span = document.querySelector('.music-title-content');
    if (!span) return;

        span.textContent = title;
        span.style.animation = 'none';
        void span.offsetWidth;

        currentMusicDisplayAnimation(span);

        document.querySelectorAll(".music-title-part").forEach(el => {
            el.classList.add("music-title-part-active");
            el.classList.remove("music-title-part-disabled");
    });
}

function currentMusicDisplayAnimation(spanElement) {
    requestAnimationFrame(() => {
        const containerWidth = spanElement.parentElement.offsetWidth;
        const textWidth = spanElement.scrollWidth;

        const shouldScroll = textWidth > containerWidth;

        if (shouldScroll) {
            const distance = textWidth + containerWidth;
            spanElement.style.setProperty('--scroll-distance', `${distance}px`);

            const duration = (distance / 100) * 1.5;
            spanElement.style.left = '100%';
            spanElement.style.transform = '';
            borders.forEach(border => {
                border.style.display = 'block';
            });
            spanElement.style.animation = `scrollText ${duration}s linear infinite`;
        } else {
            borders.forEach(border => {
                border.style.display = 'none';
            });
            spanElement.style.left = '0%';
            spanElement.style.animation = 'none';
        }
    });
}

// Player play/pause
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
});

audio.addEventListener("play", () => { updatePlayPauseIcon(); });
audio.addEventListener("pause", () => { updatePlayPauseIcon(); });


// Progress bar
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
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
let p = false; 

progressBar.parentElement.addEventListener('mousedown', (e) => {
    if (!audio.paused) {
        audio.pause();
        p = true;
    }

    isDragging = true;
    updateProgress(e);
});

progressBar.parentElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    updateProgress(e);
});

progressBar.parentElement.addEventListener('mouseup', () => {
    audioPlayOnProgressBarEvent();
});

progressBar.parentElement.addEventListener('mouseleave', () => {
    if (isDragging) {
        audioPlayOnProgressBarEvent();
    }
});

function audioPlayOnProgressBarEvent() {
    if (p) {
        audio.play();
    }

    p = false;
    isDragging = false;
}

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

    if (audio.muted || audio.volume === 0) {
        volumeImg.classList.add("player-volume-0");
    } else if (volumePercent <= 50) {
        volumeImg.classList.add("player-volume-50");
    } else {
        volumeImg.classList.add("player-volume-100");
    }
    console.log("✅ Audio changed :", parseInt(audio.volume * 100), " 💡 Class : ", volumeImg.className);
}
audio.addEventListener('volumechange', updateVolumeIcon);

function setVolume(clientX) {
    if (audio.muted) {
        volumeValue.textContent = "X";
        return;
    };

    const rect = volumeControl.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    audio.volume = percent;

    volumeFill.style.width = `${percent * 100}%`;
    volumeThumb.style.left = `${percent * 100}%`;
}

volumeControl.addEventListener('mousedown', (e) => {
    if (audio.muted) {
        volumeValue.textContent = "X";
        return;
    } else {
        setVolume(e.clientX);
        previousVolume = audio.volume;
        volumeValue.textContent = Number(audio.volume * 100).toFixed(0);
        isVolumeDragging = true;  
    }
});

let isVolumeDragging = false;

document.addEventListener('mousemove', (e) => {
    if (audio.muted) {
        volumeValue.textContent = "X";
        return;
    } else {
        if (isVolumeDragging) {
            setVolume(e.clientX);
            previousVolume = audio.volume;
            volumeValue.textContent = Number(audio.volume * 100).toFixed(0);
            isVolumeDragging = true; 
        } 
    }
});

document.addEventListener('mouseup', () => {
    isVolumeDragging = false;
});

function setInitialVolume() {
    const percent = audio.volume;
    volumeFill.style.width = `${percent * 100}%`;
    volumeThumb.style.left = `${percent * 100}%`;
}

audio.addEventListener('volumechange', setInitialVolume);
setInitialVolume();

let previousVolume = audio.volume;

volumeMute.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = previousVolume > 0 ? previousVolume : 0.5;

        volumeValue.textContent = Number(audio.volume * 100).toFixed(0);

        volumeFill.classList.remove('player-volume-fill-disabled');

        volumeMute.classList.remove('mute');
        volumeMute.classList.add('demute');
    } else {
        previousVolume = audio.volume;
        audio.muted = true;

        volumeValue.textContent = "X";

        volumeFill.classList.add('player-volume-fill-disabled');

        volumeMute.classList.remove('demute');
        volumeMute.classList.add('mute');
    }

    setInitialVolume();
});


// Backward and forward track
nextBtn.addEventListener('click', async() => {
    if (globalValues.currentTrackIndex < globalValues.musicList.data.length - 1) {
        globalValues.currentTrackIndex += 1;
    }
    else { globalValues.currentTrackIndex = 0; }
    await playTrackByIndex(globalValues.currentTrackIndex);
});

prevBtn.addEventListener('click', async () => {
    let newValue = globalValues.currentTrackIndex;

    if (audio.currentTime < 10) {
        if (newValue > 0) {
            newValue--;
        } else {
            newValue = globalValues.musicList.data.length - 1;
        }
    }

    await playTrackByIndex(newValue);
    globalValues.currentTrackIndex = newValue;
});


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

    globalValues.shuffleState = !globalValues.shuffleState;

    shuffleBtn.classList.add(
        globalValues.shuffleState ? 'shuffle' : 'no-shuffle'
    );
});

// End event
audio.onended = async() => {
    const list = globalValues.musicList.data;
    const length = list.length;

    if (!length) return;

    // Shuffle
    if (globalValues.shuffleState) {
        let randomIndex;

        do {
            randomIndex = Math.floor(
                Math.random() * length
            );
        } while (
            randomIndex === globalValues.currentTrackIndex &&
            length > 1
        );

        globalValues.currentTrackIndex = randomIndex;

        console.log("Random track:", randomIndex);

        await playTrackByIndex(randomIndex);
        return;

    } 

    if (globalValues.loopState === 'all') {
        globalValues.currentTrackIndex =
            (globalValues.currentTrackIndex + 1) % length;

        await playTrackByIndex(
            globalValues.currentTrackIndex
        );

        return;
    }

    if (globalValues.currentTrackIndex < length - 1) {
        globalValues.currentTrackIndex++;

        await playTrackByIndex(
            globalValues.currentTrackIndex
        );
    }
};
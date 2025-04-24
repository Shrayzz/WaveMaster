const audio = document.getElementById('audio-player');
const playPauseBtn = document.querySelector('.player-play-pause');
const progressBar = document.querySelector('.player-progress-bar');
const volumeControl = document.querySelector('.player-volume');
const randomBtn = document.querySelector('.player-random-btn');
const loopBtn = document.querySelector('.player-loop-btn');

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
        audio.play(); // relance la même
    } else if (loopState === 'all' || isRandomEnabled) {
        playNextRandomTrack(); // ta fonction maison
    }
});

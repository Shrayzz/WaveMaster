import { setDisplayWithAnim, setDisplayMiniWindow, showDisplay, hideDisplay } from "./animation.js";
import { getMusic, createMusic, globalValues } from './music.js'
import { updateCurrentMusicDisplay } from "./player.js";


// DOM events
window.addEventListener('DOMContentLoaded', async () => {
    const data = await getMusic();
    await createMusic(data);

    globalValues.musicItems = document.querySelectorAll('#player-container-list .music-item');
    console.log(globalValues.musicItems)

    globalValues.musicItems.forEach(item => {
        item.addEventListener('click', () => {
            const audio = document.getElementById('audio-player');
            const path = item.dataset.path;
            globalValues.currentTrackIndex = parseInt(item.dataset.index);
            console.log(" Selected index:", globalValues.currentTrackIndex)
            audio.src = path;
            audio.play();
        });
    });
});

// Window management events
document.querySelector('.main-button-player').addEventListener('click', () => setDisplayWithAnim('main', 'player'));
document.querySelector('.player-container-header .back').addEventListener('click', () => setDisplayWithAnim('player', 'main'));

// Small window events 
document.querySelector('.folder-button').addEventListener('click', () => showDisplay('folder', 'bg-main'));
document.querySelector('#folder').addEventListener('click', () => hideDisplay('folder', 'bg-main'));


let isMiniWindowOpen = false;
document.getElementById('player-volume').addEventListener('click', () => {
    setDisplayMiniWindow('volume-window', isMiniWindowOpen);
    isMiniWindowOpen = !isMiniWindowOpen;
});
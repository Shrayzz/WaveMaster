import { setDisplayWithAnim, setDisplayMiniWindow, showDisplay, hideDisplay } from "./animation.js";
import { createMusicTabs } from "./music.js";
const globalValues = await window.wmAPI.getGlobalValues();

// Window management events
document.querySelector('.main-button-player').addEventListener('click', async () => {
    setDisplayWithAnim('main', 'player');

    if (globalValues.musicList.length === 0) {
        globalValues.musicList = await window.wmAPI.loadMusic();
        console.log(globalValues.musicList);
        await createMusicTabs(globalValues.musicList.data);

        globalValues.musicItems = document.querySelectorAll('#player-container-list .music-item');

        // DOM Events
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
    }
});
document.querySelector('.player-container-header .back').addEventListener('click', () => setDisplayWithAnim('player', 'main'));

// Small window events 
document.querySelector('.folder-button').addEventListener('click', () => showDisplay('folder', 'bg-main'));
document.querySelector('#folder').addEventListener('click', () => hideDisplay('folder', 'bg-main'));


let isMiniWindowOpen = false;
document.getElementById('player-volume').addEventListener('click', () => {
    setDisplayMiniWindow('volume-window', isMiniWindowOpen);
    isMiniWindowOpen = !isMiniWindowOpen;
});
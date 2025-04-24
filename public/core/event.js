import { setDisplayWithAnim, setDisplayWithoutAnim } from "./animation.js";
import { getMusic, createMusic } from './music.js'

// DOM events
window.addEventListener('DOMContentLoaded', async() => {
    const data = await getMusic();
    createMusic(data);

    document.querySelectorAll('.music-item').forEach(item => {
        item.addEventListener('click', () => {
            const audio = document.getElementById('audio-player');
            const path = item.dataset.path;  
            audio.src = path;
            audio.play();
        });
    }); 
});

// Click events
document.querySelector('.main-button-player').addEventListener('click', () => setDisplayWithAnim('main', 'player'));
document.querySelector('.player-container-header .back').addEventListener('click', () => setDisplayWithAnim('player', 'main'));
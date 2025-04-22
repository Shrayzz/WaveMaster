import { setDisplayWithAnim, setDisplayWithoutAnim } from "./animation.js";
import { createMusicList, addFolder } from './folder.js'

// DOM loaded events
window.addEventListener('DOMContentLoaded', async() => {
    await addFolder('D:\\Musique');
    await createMusicList()
});

// Click events
document.querySelector('.main-button-player').addEventListener('click', () => setDisplayWithAnim('main', 'player'))
document.querySelector('.player-container-header .back').addEventListener('click', () => setDisplayWithAnim('player', 'main'))
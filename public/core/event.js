import { setDisplayWithAnim, setDisplayMiniWindow, showDisplay, hideDisplay } from "./animation.js";
import { applyAllEffects, resetEffects } from "./editor.js";
import { createMusicTabs } from "./music.js";
import { updateCurrentMusicDisplay } from "./player.js";
import { createFolderDiv } from "./settings.js";

const audio = document.getElementById('audio-player');
const CURRENT_VERSION = "v1.0.1";

import { globalValues } from "../../backend/data/values.js";
import { refreshGlobalValues } from "../../backend/data/values.js";

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
    console.log(globalValues)
} else {
    start();
}

// Global events
async function start() {
    console.log("Loading tracks...");
    await initTracks(globalValues);
    await initFolderTabs();
    void checkForUpdates();
}

// Manual check (for now)
async function checkForUpdates() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/Shrayzz/WaveMaster/main/version.json');
        // const res = await fetch('../version.json'); test dev only

        if (!res.ok) {
            message('⚠️ No github response. Unable to check for updates');
            return;
        }

        const { version, link, changes } = await res.json();
        if (!isNewerVersion(CURRENT_VERSION, version)) return;

        const result = confirm(
            `New update available: [${CURRENT_VERSION} → ${version}]\n\nWould you want to update ?\nhttps://github.com/Shrayzz/WaveMaster/releases\n\n\nCHANGELOG :\n\n${changes || "No more details"}`
        );

        if(!result) {
            return;
        } 
        await window.wmAPI.openWebsite("https://github.com/Shrayzz/WaveMaster/releases");

    } catch (err) {
        console.log("❌ Update check failed:", err);
    }
}

function isNewerVersion(current, latest) {
    const a = current.split('.').map(Number);
    const b = latest.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        if (b[i] > a[i]) return true;
        if (b[i] < a[i]) return false;
    }

    return false;
}

async function initTracks() {
    globalValues.musicList = await window.wmAPI.loadMusic();
    console.log("MusicList:\n", globalValues.musicList);
    await createMusicTabs(globalValues.musicList.data);

    globalValues.musicItems = document.querySelectorAll('#player-container-list .music-item');

    globalValues.musicItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index, 10);
            playTrackByIndex(index);
            globalValues.currentTrackIndex = index;

            if (!globalValues.applyEffects) {
                resetEffects();
            }
        });
    });
}

async function initFolderTabs() {
    const urlList = await window.wmAPI.getUrls();

    for (const url of urlList) {
        const urlCount = await window.wmAPI.getFolderCount(url);
        const folderDiv = createFolderDiv(url, urlCount, true);
        document.getElementById('folders-display').appendChild(folderDiv);
    }
}

export async function restart() {
    try {
        const currentCount = globalValues.musicList.data.length - 1;

        document.querySelectorAll(".music-item").forEach(el => {
            el.style.display = "none";
        });
        document.querySelectorAll("#player-container-list hr").forEach(el => {
            el.style.display = "none";
        });
        globalValues.musicList = null;
        globalValues.musicItems = [];

        const loader = document.createElement("div");
        loader.id = "player-loader";
        loader.className = "loader";

        const circleLoader = document.createElement("div");
        circleLoader.className = "circle-loader";

        const descLoader = document.createElement("div");
        descLoader.className = "desc-loader";
        descLoader.textContent = "Loading all tracks...";

        loader.append(circleLoader, descLoader);
        document.getElementById('player-container-list').appendChild(loader);


        console.log("Reloading tracks...");
        await initTracks();

        const newCount = globalValues.musicList.data.length - 1;
        let result;

        if (currentCount >= newCount) {
            result = currentCount - newCount;
        } else {
            result = newCount - currentCount;
        }
        message(`✅ All tracks directories reloaded, ${result} songs updated in list`, 0, 128, 0);

        document.querySelectorAll(".music-item").forEach(el => {
            el.style.display = "flex";
        });
        document.querySelectorAll("#player-container-list hr").forEach(el => {
            el.style.display = "flex";
        });

    } catch (err) {
        message(`❌ Unable to restart : ${err}`, 128, 0, 0);
        console.error(`❌ Unable to restart : ${err}`);
    }
};

export function message(input, r, g, b) {
    const base = document.getElementById('app');

    const block = document.createElement('div');
    block.className = 'message';
    block.style.opacity = 0;
    block.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
    block.style.backgroundColor = `rgba(
        ${Math.max(0, r - 30)},
        ${Math.max(0, g - 30)},
        ${Math.max(0, b - 30)},
        0.8
    )`;

    const message = document.createElement('p');
    message.textContent = input;

    block.append(message)
    base.appendChild(block)

    messageAnim(block, "start");
    setTimeout(() => {
        messageAnim(block, "end");
        setTimeout(() => {
            base.removeChild(block);
        }, 100);
    }, 3000);
}

function messageAnim(block, frame) {
    if (frame === "start") {
        block.animate([
            {
                opacity: 0,
            },
            {
                opacity: 1,
                transform: 'translateY(9%)'
            }], {
            duration: 100,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
    }
    else if (frame === "end") {
        block.animate([
            {
                opacity: 1,
            },
            {
                opacity: 0,
                transform: 'translateY(-9%)'
            }
        ], {
            duration: 100,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
    }
}

// Console errors filter

export function errorsFilter(msg) {
    const blocked = [
        "play() request was interrupted",
    ];

    return !blocked.some(e => msg.includes(e));
}

export async function playTrackByIndex(i) {
    if (!globalValues.musicItems || !globalValues.musicItems[i]) return;

    globalValues.musicItems.forEach(item =>
        item.classList.remove('current-track')
    );

    const currentItem = globalValues.musicItems[i];
    currentItem.classList.add('current-track');

    audio.src = currentItem.dataset.path;
    try {
        globalValues.currentTrackIndex = currentItem.dataset.index;
        console.log(globalValues.currentTrackIndex)
        await audio.play();
        await applyAllEffects();
        await updateCurrentMusicDisplay(currentItem.dataset.index);
    } catch (err) {
        console.error(err);
        message(`❌ ${err}`, 128, 0, 0);
    }
}

function setStartMode(mode) {
    if (mode === 1) {
        setDisplayWithAnim('main', 'player');
        setTimeout(() => { document.getElementById('editor-part').style.display = 'none'; }, 100);
        globalValues.mode = 1;
    }
    if (mode === 2) {
        setDisplayWithAnim('main', 'player');
        setTimeout(() => { document.getElementById('editor-part').style.display = 'flex'; }, 100);
        globalValues.mode = 2;
    }
    if (mode === 3) {
    }
}

// Github redirection
document.querySelector(".github").addEventListener('click', () => openGithub());

function openGithub() {
    const result = confirm("Do you want to open the GitHub page ?");
    if (!result) {
        return;
    }
    window.wmAPI.openWebsite("https://github.com/Shrayzz/WaveMaster");
}

// Restart event
document.querySelector(".reset-button").addEventListener('click', async () => restart());

// Img events
document.querySelectorAll("img").forEach(img => {
    img.draggable = false;
});

// Main menu events
document.querySelector('.main-button-player').addEventListener('click', async () => {
    setStartMode(1);
});
document.querySelector('.main-button-editor').addEventListener('click', async () => {
    setStartMode(2);
});
document.querySelector('.back-button').addEventListener('click', () => setDisplayWithAnim('player', 'main'));

// Toolbar events
document.querySelector('.settings-button').addEventListener('click', () => setDisplayWithAnim('player', 'settings'));
document.querySelector('.settings-toolbar .back-button').addEventListener('click', () => setDisplayWithAnim('settings', 'player'));

let isMiniWindowOpen = false;
document.getElementById('player-volume').addEventListener('click', () => {
    setDisplayMiniWindow('volume-window', isMiniWindowOpen);
    isMiniWindowOpen = !isMiniWindowOpen;
});


// Swap displays

// Player to editor
function setPlayerMode() {
    if (globalValues.mode === 1) {
        return;
    }
    if (globalValues.mode === 2) {
        setDisplayWithAnim('player', 'player');
        setTimeout(() => { document.getElementById('editor-part').style.display = 'none'; }, 100);
        globalValues.mode = 1;
    }
    if (globalValues.mode !== 1) {
    }
}
document.querySelector('.set-player-button').addEventListener('click', () => {
    setPlayerMode();
})

// Editor to player
function setEditorMode() {
    if (globalValues.mode === 1) {
        setDisplayWithAnim('player', 'player');
        setTimeout(() => { document.getElementById('editor-part').style.display = 'flex'; }, 100);
        globalValues.mode = 2;
    }
    if (globalValues.mode === 2) {
        return;
    }
    if (globalValues.mode === 2) {
    }
}

document.querySelector('.set-editor-button').addEventListener('click', () => {
    setEditorMode()
})

// Editor to playlist

// Playlist to player
// Playlist to editor

// Search event
function searchMusic(input) {

}

// document.querySelector('search-button').addEventListener('input', (event) => {
//     searchMusic(event.target.value);
// });
const fs = require('fs');
const path = require('path');
const jsmediatags = require("jsmediatags"); 

const SUPPORTED_FORMATS = ['.mp3', '.flac', '.ogg', '.wav'];

export async function createMusicList() {
    const container = document.querySelector('.player-container-list');
    const folders = JSON.parse(localStorage.getItem('folders') || '[]');
    const musicList = [];
    let isPair = 0;

    container.innerHTML = '';

    folders.forEach(folderPath => {
        try {
            const files = fs.readdirSync(folderPath);

            files.forEach(file => {
                const ext = path.extname(file).toLowerCase();
                if (!SUPPORTED_FORMATS.includes(ext)) return;

                const fullPath = path.join(folderPath, file);
                musicList.push(fullPath);

                jsmediatags.read(fullPath, {
                    onSuccess: (tag) => {
                        const title = tag.tags.title || path.basename(file, ext);
                        const artist = tag.tags.artist || "Inconnu";
                        const duration = tag.tags.duration ? formatDuration(tag.tags.duration) : "N/A";

                        const musicItem = createMusicItem(fullPath, title, artist, duration, isPair);
                        container.append(musicItem.div, musicItem.hr);
                        isPair++;
                    },
                    onError: (error) => {
                        console.error(`Erreur lors de la lecture des métadonnées de ${file}`, error);
                    }
                });
            });

        } catch (err) {
            console.error(`Erreur lors de la lecture du dossier ${folderPath}`, err);
        }
    });

    return musicList;
}

function createMusicItem(fullPath, title, artist, duration, isPair) {
    const div = document.createElement('div');
    const hr = document.createElement('hr');

    div.className = 'player-music-item';
    hr.className = 'player-music-hr';
    div.dataset.path = fullPath;

    if(isPair % 2 !== 0) {
        div.classList.add("player-music-item-black");
    } else {
        div.classList.add("player-music-item-white");
    }

    const titleP = document.createElement('p');
    titleP.className = 'player-music-title';
    titleP.textContent = title;

    const artistP = document.createElement('p');
    artistP.className = 'player-music-artist';
    artistP.textContent = artist;

    const durationP = document.createElement('p');
    durationP.className = 'player-music-duration';
    durationP.textContent = duration;

    div.append(titleP, artistP, durationP);

    return { div, hr };
}


function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const hh = h > 0 ? `${h.toString().padStart(2, '0')}:` : '';
    const mm = m.toString().padStart(2, '0');
    const ss = s.toString().padStart(2, '0');

    return `${hh}${mm}:${ss}`;
}

export async function addFolder(link) {
    let folders = JSON.parse(localStorage.getItem('folders') || '[]');
    if (!folders.includes(link)) folders.push(link);
    localStorage.setItem('folders', JSON.stringify(folders));
}

export async function removeFolder(link) {
    let folders = JSON.parse(localStorage.getItem('folders') || '[]');
    folders = folders.filter(folder => folder !== link);
    localStorage.setItem('folders', JSON.stringify(folders));
}

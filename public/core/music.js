export async function addFolder(folderURL) {
    try {
        const res = await window.wmAPI.addFolder(folderURL);
        console.log(res.message);
    } catch (err) {
        console.error(`Erreur ajout dossier ${folderURL} :`, err);
    }
}

export async function removeFolder(folderURL) {
    try {
        const res = await window.wmAPI.removeFolder(folderURL);
        console.log(res.message);
    } catch (err) {
        console.error(`Erreur suppression dossier ${folderURL} :`, err);
    }
}

export async function getMusic() {
    const message = document.querySelector('#loader .desc-loader');

    try {
        try {
            console.log('Attempting to load tracks...');
            const res = await window.wmAPI.getFolder();
            console.log(res.message);
        } catch (err) {
            console.error(`Erreur suppression dossier ${folderURL} :`, err);
            return null;
        }

        const data = await res.json();
        console.log('Musiques récupérées', data);
        return data;
    } catch (err) {
        message.style.color = "red";
        message.textContent = 'An error occurred... Please restart app.';
        console.error('Erreur réseau lors de la récupération des musiques :', err);
        return null;
    }
}

export async function createMusicTabs(data) {
    const playerLoader = document.getElementById("loader");
    const container = document.getElementById('player-container-list');
    container.innerHTML = '';

    let index = 0;

    const seen = new Set();
    const uniqueData = [];

    for (const music of data) {
        const { path: fullPath, title, artist, duration } = music;

        const key = `${music.path}|${music.title}|${music.artist}|${music.duration}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueData.push(music);
        }

        console.log("Création item:", index, title, artist, duration);

        playerLoader.style.display = "none";
        const musicItem = createMusicItem(fullPath, title, artist, duration, index);
        container.append(musicItem.div, musicItem.hr);

        index++;
    }
}


function createMusicItem(fullPath, title, artist, duration, index) {
    const div = document.createElement('div');
    const hr = document.createElement('hr');

    div.className = 'music-item';
    hr.className = 'music-hr';
    div.dataset.path = fullPath;
    div.dataset.index = index;

    div.classList.add(index % 2 !== 0 ? "music-item-black" : "music-item-white");

    const titleP = document.createElement('p');
    titleP.className = 'music-title';
    titleP.textContent = title;

    const artistP = document.createElement('p');
    artistP.className = 'music-artist';
    artistP.textContent = artist;

    const durationP = document.createElement('p');
    durationP.className = 'music-duration';
    durationP.textContent = duration;

    div.append(titleP, artistP, durationP);

    return { div, hr };
}
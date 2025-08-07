export const globalValues = {
    musicList: [],
    musicItems: [],
    currentTrackIndex: 0,
    loopState: 'none',
    shuffleState: false
}
const playerLoader = document.getElementById("loader");


export async function getMusic() {
    const message = document.querySelector('#loader .desc-loader');

    try {
        const response = await fetch('http://localhost:8000/music/get', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            message.textContent = 'An error occurred... Please restart app.';
            console.error('Erreur récupération des musiques :', response.status);
            return null;
        }

        const data = await response.json();
        console.log('Musiques récupérées', data);
        console.log("MusicList before :", globalValues.musicList);
        globalValues.musicList = data;
        console.log("MusicList after :", globalValues.musicList);

        return data;
    } catch (err) {
        message.style.color = "red";
        message.textContent = 'An error occurred... Please restart app.';
        console.error('Erreur réseau lors de la récupération des musiques :', err);
        return null;
    }
}


export async function createMusic(data) {
    const container = document.getElementById('player-container-list');
    container.innerHTML = '';

    let index = 0;

    for (const music of data) {
        const { path: fullPath, title, artist, duration } = music;

        // console.log("Création item:", index, title, artist, duration);

        const musicItem = createMusicItem(fullPath, title, artist, duration, index);
        container.append(musicItem.div, musicItem.hr);

        index++;
    }
}


function createMusicItem(fullPath, title, artist, duration, index) {
    playerLoader.style.display = "none";
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
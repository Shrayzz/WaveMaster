export async function getMusic() {
    const response = await fetch('http://localhost:8000/music/get', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.error('Erreur récupération des musiques :', response.status);
    } else {
        const data = await response.json(); 
        console.log('Musiques récupérées', data);
        return data;
    }
}

export async function createMusic(data) {
    const container = document.querySelector('.player-container-list');
    container.innerHTML = '';

    let isPair = 0;

    for (const music of data) {
        const { path: fullPath, title, artist, duration } = music;

        const musicItem = createMusicItem(fullPath, title, artist, duration, isPair);
        container.append(musicItem.div, musicItem.hr);

        isPair++;
    }
}

function createMusicItem(fullPath, title, artist, duration, isPair) {
    const div = document.createElement('div');
    const hr = document.createElement('hr');

    div.className = 'music-item';
    hr.className = 'music-hr';
    div.dataset.path = fullPath;

    div.classList.add(isPair % 2 !== 0 ? "music-item-black" : "music-item-white");

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

document.querySelectorAll('.music-item').forEach(item => {
    item.addEventListener('click', () => {
        const audio = document.getElementById('audio-player');
        const path = item.dataset.path;  
        audio.src = path;
        audio.play();
    });
}); 
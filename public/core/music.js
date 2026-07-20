export async function createMusicTabs(data) {
    const playerl = document.querySelector(".player-loader");
    const container = document.getElementById('player-container-list');

    container.innerHTML = '';

    const seen = new Set();

    const uniqueData = data.filter(music => {
        const key = `${music.path}|${music.title}|${music.artist}|${music.duration}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });

    if (playerl) {
        playerl.style.display = "none";
    }

    uniqueData.forEach((music, index) => {
        const { path: fullPath, title, artist, duration } = music;

        console.log(
            "Creating item:",
            index,
            title,
            artist,
            duration
        );

        const musicItem = createMusicItem(
            fullPath,
            title,
            artist,
            duration,
            index
        );

        container.append(
            musicItem.div,
            musicItem.hr
        );
    });
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
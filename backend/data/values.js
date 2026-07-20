export let globalValues = {
    mode: 1,
    musicList: null,
    musicItems: [],
    currentTrackIndex: 0,
    loopState: "none",
    shuffleState: false,

    applyEffects: true,
    rate: 1,
    bass: 0,
    treble: 0,
    gain: 100,
    reverb: 0
} 

export async function refreshGlobalValues() {
    const values = await window.wmAPI.getUrls();
    globalValues.urls = values;

    return globalValues;
}


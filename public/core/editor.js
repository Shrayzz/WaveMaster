import { downloadableCopy } from "./download.js";
import { message } from "./event.js";

const audio = document.getElementById("audio-player");
const resetBtn = document.querySelector(".editor-reset-button");
const dwnldBtn = document.querySelector(".download-editor");
const rateSlider = document.getElementById("rate-slider");
const rateValue = document.getElementById("rate-value");
const gainSlider = document.getElementById("gain-slider");
const gainValue = document.getElementById("gain-value");
const reverbSlider = document.getElementById("reverb-slider");
const reverbValue = document.getElementById("reverb-value");
const bassSlider = document.getElementById("bass-slider");
const bassValue = document.getElementById("bass-value");
const trebleSlider = document.getElementById("treble-slider");
const trebleValue = document.getElementById("treble-value");

import { globalValues } from "../../backend/data/values.js";

const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
console.log("AudioContext state:", audioCtx.state);

// Reset
resetBtn.addEventListener('click', () => {
    resetEffects();
    message('✅ All values have been reset', 0, 128, 0);
});

export function resetEffects() {
    console.log('⚠️ Resetting all values');
    setRate(1);
    rateSlider.value = 1;
    rateValue.textContent = '1.00';

    setReverb(0);
    reverbSlider.value = 0;
    reverbValue.textContent = '0';

    setBass(0);
    bassSlider.value = 0;
    bassValue.textContent = '0';

    setTreble(0);
    trebleSlider.value = 0;
    trebleValue.textContent = '0';

    expandGain(100);
    gainSlider.value = 0;
    gainValue.textContent = '100%';
}

// Mode all-time only-one-music application des effets
export function applyAllEffects() {
    if (globalValues.applyEffects) {
        setRate(globalValues.rate);
        setReverb(globalValues.reverb);
        setBass(globalValues.bass);
        setTreble(globalValues.treble);
        expandGain(globalValues.gain);
    }
}

// Compressor
const compressor = audioCtx.createDynamicsCompressor();

compressor.threshold.value = -10;
compressor.knee.value = 20;
compressor.ratio.value = 12;
compressor.attack.value = 0.003;
compressor.release.value = 0.25;

// Rate
rateSlider.addEventListener("input", () => {
    const value = parseFloat(rateSlider.value);
    rateValue.textContent = value.toFixed(2);
    setRate(value);
});

export function setRate(rate) {
    audio.preservesPitch = false;
    audio.playbackRate = rate;

    if (globalValues.applyEffects) {
        globalValues.rate = rate;
        console.log("✅ Rate global : ", globalValues.rate)
    }
}

// Reverb
const reverbCtx = audioCtx.createConvolver();
const wetGain = audioCtx.createGain();
const dryGain = audioCtx.createGain();

wetGain.gain.value = 0;
dryGain.gain.value = 1;

reverbSlider.addEventListener('input', () => {
    const value = reverbSlider.value;
    reverbValue.textContent = value;
    setReverb(value);
});

function loadReverb() {
    const duration = 3;
    const decay = 4;

    const length = audioCtx.sampleRate * duration;

    const impulse = audioCtx.createBuffer(
        2,
        length,
        audioCtx.sampleRate
    );

    for (let c = 0; c < 2; c++) {
        const data = impulse.getChannelData(c);

        for (let i = 0; i < length; i++) {

            data[i] =
                (Math.random() * 2 - 1) *
                Math.pow(1 - i / length, decay);
        }
    }

    reverbCtx.buffer = impulse;
}
loadReverb();

export function setReverb(reverb) {

    const wet = reverb / 20;

    wetGain.gain.value = wet * 0.4;

    if (globalValues.applyEffects) {
        globalValues.reverb = reverb;
        console.log("✅ Reverb global : ", globalValues.rate)
    }
}

// Bass
const bassCtx = audioCtx.createBiquadFilter();
bassCtx.type = "lowshelf";
bassCtx.frequency.value = 200; // TODO: Add dans les paramètres

bassSlider.addEventListener('input', () => {
    const value = bassSlider.value;
    bassValue.textContent = value;
    setBass(value);
});

export function setBass(bass) {
    bassCtx.gain.value = bass;

    if (globalValues.applyEffects) {
        globalValues.bass = bass;
        console.log("✅ Bass global : ", globalValues.bass)
    }
}

// Treble
const trebleCtx = audioCtx.createBiquadFilter();
trebleCtx.type = "highshelf";
trebleCtx.frequency.value = 3000;

trebleSlider.addEventListener('input', () => {
    const value = trebleSlider.value;
    trebleValue.textContent = value;
    setTreble(value);
});

export function setTreble(treble) {
    trebleCtx.gain.value = treble;

    if (globalValues.applyEffects) {
        globalValues.treble = treble;
        console.log("✅ Treble global : ", globalValues.treble)
    }
}

// Download copy with effects
dwnldBtn.addEventListener('click', () => {
    downloadableCopy();
});

// Gain
const gainNode = audioCtx.createGain();

gainSlider.addEventListener('input', () => {
    const value = Number(gainSlider.value);
    gainValue.textContent = `${value}%`;
    expandGain(value);
});

export function expandGain(gain) {
    gainNode.gain.value = gain / 100;

    if (globalValues.applyEffects) {
        globalValues.gain = gain;
        console.log("✅ Gain global :", globalValues.gain);
    }
}

// Audio connections
source.connect(compressor);
compressor.connect(bassCtx);
bassCtx.connect(trebleCtx);
trebleCtx.connect(gainNode);

gainNode.connect(dryGain);
dryGain.connect(audioCtx.destination);

gainNode.connect(reverbCtx);
reverbCtx.connect(wetGain);
wetGain.connect(audioCtx.destination);

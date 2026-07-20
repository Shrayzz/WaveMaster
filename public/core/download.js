import { message } from "./event.js";

import { globalValues } from "../../backend/data/values.js";
const audio = document.getElementById("audio-player");

export async function downloadableCopy() {
    const url = audio.currentSrc || audio.src;
    if(!url) {
        message('⚠️ Select a track for download', 252, 190, 3);
        return;
    } 
    
    const response = await fetch(url);
    if (!response.ok) {
        message("⚠️ Cannot load audio file", 252, 190, 5);
        return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const rate = parseFloat(document.getElementById("rate-slider").value);

    const ctx = new AudioContext();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const offlineCtx = new OfflineAudioContext(
        2,
        Math.ceil(audioBuffer.length / rate),
        audioBuffer.sampleRate
    );

    const source = offlineCtx.createBufferSource();
    source.buffer = audioBuffer;

    source.playbackRate.value = rate;

    const bass = offlineCtx.createBiquadFilter();
    bass.type = "lowshelf";
    bass.frequency.value = 200;
    bass.gain.value = document.getElementById("bass-slider").value;

    const treble = offlineCtx.createBiquadFilter();
    treble.type = "highshelf";
    treble.frequency.value = 3000;
    treble.gain.value = document.getElementById("treble-slider").value;

    const gainNode = offlineCtx.createGain();
    gainNode.gain.value = Number(document.getElementById("gain-slider").value) / 100;

    source.connect(bass);
    bass.connect(treble);
    treble.connect(gainNode);
    gainNode.connect(offlineCtx.destination);

    source.start();
    const renderedBuffer = await offlineCtx.startRendering();

    const result = await window.wmAPI.chooseSavePath();
    if (!result) {
        message(`❌ Operation canceled`, 128, 0, 0);
        return;
    } 
    const wavBlob = audioBufferToWav(renderedBuffer);
    const arrayBufferOut = await wavBlob.arrayBuffer();

    console.log("filePath =", result);
    console.log("buffer =", arrayBufferOut);
    await window.wmAPI.saveFile(result, arrayBufferOut);

    message(`✅ Export done : ${result}`, 0, 128, 0);
}

function audioBufferToWav(buffer) {
    const numChannels = 2;
    const sampleRate = buffer.sampleRate;
    const length = buffer.length * numChannels * 2 + 44;

    const ab = new ArrayBuffer(length);
    const view = new DataView(ab);

    let offset = 0;

    const writeString = (s) => {
        for (let i = 0; i < s.length; i++) {
            view.setUint8(offset++, s.charCodeAt(i));
        }
    };

    const write16 = (v) => {
        view.setUint16(offset, v, true);
        offset += 2;
    };

    const write32 = (v) => {
        view.setUint32(offset, v, true);
        offset += 4;
    };

    // RIFF
    writeString("RIFF");
    write32(length - 8);
    writeString("WAVE");

    // fmt
    writeString("fmt ");
    write32(16);
    write16(1);
    write16(numChannels);
    write32(sampleRate);
    write32(sampleRate * numChannels * 2);
    write16(numChannels * 2);
    write16(16);

    // data
    writeString("data");
    write32(length - offset - 4);

    const left = buffer.getChannelData(0);
    const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left;

    for (let i = 0; i < buffer.length; i++) {
        const l = Math.max(-1, Math.min(1, left[i]));
        const r = Math.max(-1, Math.min(1, right[i]));

        view.setInt16(offset, l < 0 ? l * 0x8000 : l * 0x7fff, true);
        offset += 2;

        view.setInt16(offset, r < 0 ? r * 0x8000 : r * 0x7fff, true);
        offset += 2;
    }

    return new Blob([ab], { type: "audio/wav" });
}
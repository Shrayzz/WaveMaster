import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';

const folders = require('./data/folders.json')
const SUPPORTED_FORMATS = ['.mp3', '.flac', '.ogg', '.wav'];

export async function createMusic() {
    let music = [];

    for (const folderPath of folders.folders) {
        try {
            const files = fs.readdirSync(folderPath);

            for (const file of files) {
                const ext = path.extname(file).toLowerCase();
                if (!SUPPORTED_FORMATS.includes(ext)) continue;

                const fullPath = path.join(folderPath, file);

                try {
                    const metadata = await mm.parseFile(fullPath);
                    const title = metadata.common.title || path.basename(file, ext);
                    const artist = metadata.common.artist || "Artiste Inconnu";
                    const duration = metadata.format.duration
                        ? formatDuration(metadata.format.duration)
                        : "N/A";

                    music.push({
                        path: fullPath,
                        title,
                        artist,
                        duration
                    });

                } catch (metaErr) {
                    console.error(`Erreur de métadonnées : ${file}`, metaErr);
                }
            }

        } catch (err) {
            console.error(`Erreur lecture dossier : ${folderPath}`, err);
        }
    }

    return music;
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
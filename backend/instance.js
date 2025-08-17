import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folders = path.join(__dirname, 'data', 'folders.json');
const SUPPORTED_FORMATS = ['.mp3', '.flac', '.ogg', '.wav'];

function readFolders() {
    try {
        const data = fs.readFileSync(folders, 'utf-8');
        return JSON.parse(data).folders || [];
    } catch (err) {
        console.error("Erreur lecture du fichier folders.json :", err);
        return [];
    }
}

export async function createMusic() {
    let music = [];
    const folders = readFolders();  

    for (const folderPath of folders) {
        try {
            const allFiles = getAllFilesRecursively(folderPath);

            const supportedFiles = allFiles.filter(filePath => {
                const ext = path.extname(filePath).toLowerCase();
                return SUPPORTED_FORMATS.includes(ext);
            });

            const promises = supportedFiles.map(async (filePath) => {
                try {
                    const metadata = await mm.parseFile(filePath);
                    const ext = path.extname(filePath).toLowerCase();
                    const title = metadata.common.title || path.basename(filePath, ext);
                    const artist = metadata.common.artist || "Artiste Inconnu";
                    const duration = metadata.format.duration
                        ? formatDuration(metadata.format.duration)
                        : "N/A";

                    return { path: filePath, title, artist, duration };
                } catch (err) {
                    console.error(`Erreur de métadonnées : ${filePath}`, err);
                    return null; 
                }
            });

            const results = await Promise.all(promises);
            music = music.concat(results.filter(item => item !== null));

        } catch (err) {
            console.error(`Erreur lecture dossier : ${folderPath}`, err);
        }
    }

    music.sort((a, b) => a.title.localeCompare(b.title));
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

function getAllFilesRecursively(dirPath) {
    let results = [];
    const list = fs.readdirSync(dirPath);

    for (const file of list) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results = results.concat(getAllFilesRecursively(fullPath));
        } else {
            results.push(fullPath);
        }
    }

    return results;
}
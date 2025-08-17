import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FOLDER_PATH = path.join(__dirname, 'data', 'folders.json');


function readFolders() {
    try {
        const data = readFileSync(FOLDER_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Erreur lecture du fichier :", err);
        return { folders: [] };
    }
}

function writeFolders(json) {
    try {
        writeFileSync(FOLDER_PATH, JSON.stringify(json, null, 4), 'utf-8');
    } catch (err) {
        console.error("Erreur écriture du fichier :", err);
    }
}

export async function addFolder(folderURL) {
    try {
        const json = readFolders();

        if (!json.folders.includes(folderURL)) {
            json.folders.push(folderURL);
            writeFolders(json);
            console.log(`Dossier ajouté : ${folderURL}`);
        } else {
            console.log(`ℹDossier déjà existant : ${folderURL}`);
        }
    } catch (err) {
        console.error("Erreur d'ajout de dossier :", err);
    }
}

export async function removeFolder(folderURL) {
    try {
        const json = readFolders();
        const newFolders = json.folders.filter(f => f !== folderURL);

        if (newFolders.length !== json.folders.length) {
            json.folders = newFolders;
            writeFolders(json);
            console.log(`Dossier supprimé : ${folderURL}`);
        } else {
            console.log(`Dossier non trouvé : ${folderURL}`);
        }
    } catch (err) {
        console.error("Erreur suppression dossier :", err);
    }
}

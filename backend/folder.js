const fs = require('fs');
const path = require('path');

const FOLDER_PATH = path.join(__dirname, 'data', 'folders.json');

export async function addFolder(folderURL) {
    try {
        const data = fs.readFileSync(FOLDER_PATH, 'utf-8');
        const json = JSON.parse(data);

        if (!json.folders.includes(folderURL)) {
            json.folders.push(folderURL);
            fs.writeFileSync(FOLDER_PATH, JSON.stringify(json, null, 4), 'utf-8');
            console.log(`Dossier ajouté : ${folderURL}`);
        } else {
            console.log(`Dossier déjà existant : ${folderURL}`);
        }
    } catch (err) {
        console.error('Erreur d\'ajout de dossier :', err);
    }
}


export async function removeFolder(folderURL) {}
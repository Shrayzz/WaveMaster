import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globalValues } from './data/values.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FOLDER_PATH = path.join(__dirname, 'data', 'folders.json');

export function addFolder(folderURL) {
    folderURL = path.normalize(folderURL);

    if (globalValues.urls.includes(folderURL)) {
        console.log(`❌ Folder already exists : ${folderURL}`);
        return false;
    }

    globalValues.urls.push(folderURL);
    console.log(`✅ Successfully added folder : ${folderURL}`);

    return true;
}

export function removeFolder(folderURL) {
    folderURL = path.normalize(folderURL);

    const index = globalValues.urls.indexOf(folderURL);

    if (index === -1) {
        console.log(`❌ Folder doesn't exist in queue : ${folderURL}`);
        return false;
    }

    globalValues.urls.splice(index, 1);

    console.log(`✅ Successfully removed folder : ${folderURL}`);
    return true;
}

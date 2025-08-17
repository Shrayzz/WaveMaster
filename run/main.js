import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createMusic } from '../backend/instance.js';
import { addFolder, removeFolder } from '../backend/folder.js';

export const globalValues = {
    urls: [],
    musicList: [],
    musicItems: [],
    currentTrackIndex: 0,
    loopState: 'none',
    shuffleState: false
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        frame: false,
        resizable: true,
        minWidth: 1000,
        minHeight: 600,
        icon: 'wm.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        autoHideMenuBar: true,
        titleBarStyle: "hidden",
        titleBarOverlay: {
            height: 40,
            color: "#00000000",
            symbolColor: "#ffffff",
        },
    });
    win.loadFile(path.join(__dirname, '../public/index.html'));
    win.webContents.openDevTools();
}

// Preload

// Third-party serving

ipcMain.handle('values', async () => {
    return globalValues;
});

ipcMain.handle('music:load', async (event) => {
    try {
        globalValues.musicList = await createMusic();
        console.log(`Finished createMusic for with musicList length : ${globalValues.musicList.length}`);
    

        return { data: globalValues.musicList, success: true, message: 'Folder successfully registered!' };
    } catch (e) {
        return { success: false, message: `An error occurred : ${e}` };
    }
});

ipcMain.handle('music:add', async (event, url) => {
    try {
        await addFolder(url);
        console.log(`Adding folder : ${url}`);

        globalValues.folders.push(url);

        return { success: true, message: 'Folder successfully registered!' };
    } catch (e) {
        return { success: false, message: `An error occurred : ${e}` };
    }
})

ipcMain.handle('music:remove', async (event, folder) => {
    try {
        await removeFolder(folder);
        console.log(`Suppression du dossier : ${folder}`);
        return { success: true, message: 'Dossier supprimé' };
    } catch (e) {
        return { success: false, message: `An error occurred : ${e}` };
    }
})

app.on('ready', createWindow);
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { dialog } from "electron";
import { globalValues } from '../backend/data/values.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedExtensions = [
    ".mp3",
    ".wav",
    ".flac",
    ".ogg"
];

import { createMusic } from '../backend/instance.js';
import { addFolder, removeFolder } from '../backend/folder.js';

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
            devTools: !app.isPackaged,
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
}

// Preload
// Third-party serving
ipcMain.handle('get:urls', () => {
    const localPath = path.join(__dirname, "data", "urls.json");

    if (fs.existsSync(localPath)) {
        return JSON.parse(fs.readFileSync(localPath, "utf8"));
    }

    const installPath = path.dirname(process.execPath);
    const userDataFolder = path.join(installPath, "userdata");
    const urlsFile = path.join(userDataFolder, "urls.json");

    if (fs.existsSync(urlsFile)) {
        return JSON.parse(fs.readFileSync(urlsFile, "utf8"));
    }

    return [];
});

ipcMain.handle('write:urls', (event, urls) => {
    const localPath = path.join(__dirname, "data", "urls.json");

    try {
        fs.writeFileSync(localPath, JSON.stringify(urls, null, 2), "utf8");
        return true;
    } catch (err) {
        const installPath = path.dirname(process.execPath);
        const userDataFolder = path.join(installPath, "userdata");
        const urlsFile = path.join(userDataFolder, "urls.json");

        fs.mkdirSync(userDataFolder, { recursive: true });

        fs.writeFileSync(urlsFile, JSON.stringify(urls, null, 2), "utf8");
        return true;
    }
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

ipcMain.handle("choose-save-path", async () => {
    const result = await dialog.showSaveDialog({
        title: "Save audio file",
        defaultPath: "export.wav",
        filters: [
            { name: "WAV Audio", extensions: ["wav"] }
        ]
    });

    return result.canceled ? null : result.filePath;
});

ipcMain.handle("save-file", async (event, filePath, buffer) => {
    fs.writeFileSync(filePath, Buffer.from(buffer));
});

ipcMain.handle("new-folder-path", async () => {
    const result = await dialog.showOpenDialog({
        title: "Choose new folder path",
        properties: ['openDirectory']
    })

    return result.canceled ? null : result.filePaths[0];
})

ipcMain.handle("get-folder-count", async (event, filePath) => {

    function countMusicFiles(dir) {
        let count = 0;

        const entries = fs.readdirSync(dir, {
            withFileTypes: true
        });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                count += countMusicFiles(fullPath);
            } else {
                const ext = path.extname(entry.name).toLowerCase();

                if (allowedExtensions.includes(ext)) {
                    count++;
                }
            }
        }
        return count;
    }
    return countMusicFiles(filePath);
});

ipcMain.on('open-website', (event, url) => {
    shell.openExternal(url);
});

app.on('ready', createWindow);
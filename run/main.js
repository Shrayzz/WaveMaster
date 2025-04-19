const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        frame: false,
        resizable: true,
        minWidth: 1000,
        minHeight: 600,
        icon: './src/icons/wavemaster.ico',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        titleBarStyle: "hidden",
        titleBarOverlay: {
            height: 40,
            color: "#00000000",
            symbolColor: "#ffffff",
        },
    });
    win.loadFile(path.join(__dirname, '../src/index.html'));
    win.webContents.openDevTools();
}

app.on('ready', createWindow);
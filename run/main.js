const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 450,
        frame: false,
        resizable: true,
        minWidth: 750,
        minHeight: 500,
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
}
app.on('ready', createWindow);
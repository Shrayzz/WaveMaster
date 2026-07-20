const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wmAPI', {
    getUrls: () => ipcRenderer.invoke('get:urls'),
    writeUrls: (urls) => ipcRenderer.invoke('write:urls', urls),
    loadMusic: () => ipcRenderer.invoke('music:load'),
    chooseSavePath: () => ipcRenderer.invoke("choose-save-path"),
    saveFile: (event, filePath, buffer) => ipcRenderer.invoke("save-file", event, filePath, buffer),
    getFolderPath: () => ipcRenderer.invoke('new-folder-path'),
    getFolderCount: (filePath) => ipcRenderer.invoke('get-folder-count', filePath)
});
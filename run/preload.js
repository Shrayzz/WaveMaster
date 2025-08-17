const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wmAPI', {
    getGlobalValues: () => ipcRenderer.invoke('values'),
    addMusic: (url) => ipcRenderer.invoke('music:add', url),
    loadMusic: () => ipcRenderer.invoke('music:load'),
    removeMusic: (url) => ipcRenderer.invoke('music:remove', url)
});
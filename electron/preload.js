
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    showNotification: (options) => ipcRenderer.invoke('show-notification', options),
    onStartTimer: (callback) => {
      ipcRenderer.on('start-timer', () => callback());
      return () => ipcRenderer.removeAllListeners('start-timer');
    },
    onPauseTimer: (callback) => {
      ipcRenderer.on('pause-timer', () => callback());
      return () => ipcRenderer.removeAllListeners('pause-timer');
    }
  }
);

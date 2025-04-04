import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("electron", {
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings: unknown) =>
    ipcRenderer.invoke("save-settings", settings),
  showNotification: (options: unknown) =>
    ipcRenderer.invoke("show-notification", options),
  onStartTimer: (callback: () => void) => {
    ipcRenderer.on("start-timer", () => callback());
    return () => ipcRenderer.removeAllListeners("start-timer");
  },
  onPauseTimer: (callback: () => void) => {
    ipcRenderer.on("pause-timer", () => callback());
    return () => ipcRenderer.removeAllListeners("pause-timer");
  },
});

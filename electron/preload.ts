import { contextBridge, ipcRenderer } from "electron";

interface ElectronAPI {
  getSettings: () => Promise<unknown>;
  getStretchingTips: () => Promise<unknown>;
  saveSettings: (settings: unknown) => Promise<boolean>;
  showNotification: (options: { title: string; body: string }) => void;
  showWindow: () => void;
  minimize: () => void;
  setWindowHeight: (height: number) => void;
  close: () => void;
  onStartTimer: (callback: () => void) => () => void;
  onPauseTimer: (callback: () => void) => () => void;
}

contextBridge.exposeInMainWorld("electron", {
  getSettings: () => ipcRenderer.invoke("get-settings"),
  getStretchingTips: () => ipcRenderer.invoke("get-stretching-tips"),
  saveSettings: (settings: unknown) =>
    ipcRenderer.invoke("save-settings", settings),
  showNotification: (options: { title: string; body: string }) => {
    console.log("preload: Sending show-notification", options);
    ipcRenderer.send("show-notification", options);
  },
  showWindow: () => {
    console.log("preload: Sending show-window");
    ipcRenderer.send("show-window");
  },
  minimize: () => {
    console.log("preload: Sending minimize-window");
    ipcRenderer.send("minimize-window");
  },
  setWindowHeight: (height: number) => {
    console.log("preload: Sending set-window-height", height);
    ipcRenderer.send("set-window-height", height);
  },
  close: () => {
    console.log("preload: Sending close-window");
    ipcRenderer.send("close-window");
  },
  onStartTimer: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("start-timer", handler);
    return () => {
      ipcRenderer.removeListener("start-timer", handler);
    };
  },
  onPauseTimer: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on("pause-timer", handler);
    return () => {
      ipcRenderer.removeListener("pause-timer", handler);
    };
  },
} as ElectronAPI);

import { contextBridge, ipcRenderer } from "electron/renderer";

contextBridge.exposeInMainWorld("electron", {
  getSettings: () => ipcRenderer.invoke("get-settings"),
  saveSettings: (settings: unknown) =>
    ipcRenderer.invoke("save-settings", settings),
  // Pass title and body correctly
  showNotification: ({ title, body }: { title: string; body: string }) => 
    ipcRenderer.send("show-notification", { title, body }), // Use send for one-way notification
  // Add function to request showing the window
  showWindow: () => ipcRenderer.send("show-window"), 
  onStartTimer: (callback: () => void) => {
    const listener = () => callback(); // Store listener to remove specific instance
    ipcRenderer.on("start-timer", listener);
    return () => ipcRenderer.removeListener("start-timer", listener); // Remove specific listener
  },
  onPauseTimer: (callback: () => void) => {
    const listener = () => callback(); // Store listener to remove specific instance
    ipcRenderer.on("pause-timer", listener);
    return () => ipcRenderer.removeListener("pause-timer", listener); // Remove specific listener
  },
});

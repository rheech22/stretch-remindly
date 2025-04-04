import { contextBridge, ipcRenderer } from 'electron';

// Define the types for the exposed API more precisely
interface ElectronAPI {
  getSettings: () => Promise<any>; // Will be refined in electron.d.ts
  saveSettings: (settings: any) => Promise<boolean>; // Will be refined in electron.d.ts
  showNotification: (options: { title: string; body: string }) => void;
  showWindow: () => void;
  minimize: () => void;
  close: () => void;
  onStartTimer: (callback: () => void) => () => void;
  onPauseTimer: (callback: () => void) => () => void;
}

contextBridge.exposeInMainWorld('electron', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  showNotification: (options: { title: string; body: string }) => {
    console.log('preload: Sending show-notification', options);
    ipcRenderer.send('show-notification', options);
  },
  showWindow: () => {
    console.log('preload: Sending show-window');
    ipcRenderer.send('show-window');
  },
  minimize: () => {
    console.log('preload: Sending minimize-window');
    ipcRenderer.send('minimize-window');
  },
  close: () => {
    console.log('preload: Sending close-window');
    ipcRenderer.send('close-window');
  },
  // Example listeners (if needed, ensure they are correctly set up in main.ts)
  onStartTimer: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('start-timer', handler);
    // Return an unsubscribe function
    return () => {
      ipcRenderer.removeListener('start-timer', handler);
    };
  },
  onPauseTimer: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('pause-timer', handler);
    // Return an unsubscribe function
    return () => {
      ipcRenderer.removeListener('pause-timer', handler);
    };
  },
} as ElectronAPI); // Cast to the defined interface

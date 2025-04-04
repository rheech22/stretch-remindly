// Define the shape of the Settings object used in both main and renderer
export interface Settings {
  workDuration: number;
  stretchDuration: number;
  startMinimized: boolean;
  runAtStartup: boolean;
}

export interface ElectronAPI {
  // Return the full Settings object
  getSettings: () => Promise<Settings>; 
  // Accept a partial Settings object for updates
  saveSettings: (settings: Partial<Settings>) => Promise<boolean>; 
  showNotification: (options: {
    title: string;
    body: string;
  }) => void; 
  showWindow: () => void;
  onStartTimer: (callback: () => void) => () => void;
  onPauseTimer: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

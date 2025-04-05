export interface Settings {
  workDuration: number;
  stretchDuration: number;
  startMinimized: boolean;
  runAtStartup: boolean;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export interface ElectronAPI {
  getSettings: () => Promise<Settings>;
  saveSettings: (settings: Partial<Settings>) => Promise<boolean>;
  showNotification: (options: { title: string; body: string }) => void;
  showWindow: () => void;
  minimize: () => void;
  setWindowHeight: (height: number) => void;
  close: () => void;
  onStartTimer: (callback: () => void) => () => void;
  onPauseTimer: (callback: () => void) => () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

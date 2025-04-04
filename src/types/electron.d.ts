export interface ElectronAPI {
  getSettings: () => Promise<{
    workDuration: number;
    stretchDuration: number;
    startMinimized: boolean;
    runAtStartup: boolean;
  }>;
  saveSettings: (settings: {
    workDuration?: number;
    stretchDuration?: number;
    startMinimized?: boolean;
    runAtStartup?: boolean;
  }) => Promise<boolean>;
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

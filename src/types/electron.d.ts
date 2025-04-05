export interface Settings {
  workDuration: number;
  stretchDuration: number;
  startMinimized: boolean;
  runAtStartup: boolean;
}

export interface StretchingTip {
  created_at: string;
  description: string | null;
  id: number;
  title: string;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export interface ElectronAPI {
  getSettings: () => Promise<Settings>;
  getStretchingTips: () => Promise<StretchingTip[]>;
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

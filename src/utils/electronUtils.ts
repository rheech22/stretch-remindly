import { Settings } from "@/types/electron";

export const isElectron = (): boolean => !!window.electron;

export const getElectronSettings = async (): Promise<Settings> => {
  if (!isElectron()) {
    console.warn("Not running in Electron, returning default settings.");
    return {
      workDuration: 25 * 60,
      stretchDuration: 5 * 60,
      startMinimized: false,
      runAtStartup: false,
    };
  }
  try {
    const settings = await window.electron.getSettings();
    console.log("Settings loaded from main:", settings);
    return settings;
  } catch (error) {
    console.error("Failed to get settings from main:", error);
    return {
      workDuration: 25 * 60,
      stretchDuration: 5 * 60,
      startMinimized: false,
      runAtStartup: false,
    };
  }
};

export const saveElectronSettings = async (
  settings: Partial<Settings>,
): Promise<boolean> => {
  if (!isElectron()) {
    console.warn("Not running in Electron, cannot save settings.");
    return false;
  }
  try {
    const success = await window.electron.saveSettings(settings);
    console.log("Settings save attempt result:", success);
    return success;
  } catch (error) {
    console.error("Failed to save settings to main:", error);
    return false;
  }
};

export const showNativeNotification = (title: string, body: string) => {
  if (!isElectron()) return;

  window.electron.showNotification({ title, body });
};

export const showMainWindow = () => {
  if (!isElectron()) return;
  window.electron.showWindow();
};

type TimerCallback = () => void;

type UnsubscribeFunction = () => void;

export const registerTimerListeners = (
  onStart: TimerCallback,
  onPause: TimerCallback,
): UnsubscribeFunction => {
  if (!isElectron()) {
    return () => {};
  }

  const unsubscribeStart = window.electron.onStartTimer(onStart);
  const unsubscribePause = window.electron.onPauseTimer(onPause);

  return () => {
    unsubscribeStart();
    unsubscribePause();
  };
};

export const changeWindowHeight = (height: number) => {
  if (!isElectron()) return;
  window.electron.setWindowHeight(height);
};

// Check if running in Electron
export const isElectron = (): boolean => {
  return window && "electron" in window;
};

// Get settings from Electron store
export const getElectronSettings = async () => {
  if (!isElectron()) return null;
  return await window.electron.getSettings();
};

// Save settings to Electron store
export const saveElectronSettings = async (settings: {
  workDuration?: number;
  stretchDuration?: number;
  startMinimized?: boolean;
  runAtStartup?: boolean;
}) => {
  if (!isElectron()) return false;
  return await window.electron.saveSettings(settings);
};

// Show native notification via main process
export const showNativeNotification = (title: string, body: string) => {
  if (!isElectron()) return;
  window.electron.showNotification({ title, body });
};

// Ask the main process to show the main window
export const showMainWindow = () => {
  if (!isElectron()) return;
  window.electron.showWindow();
};

// Register event listeners for timer controls from system tray
export const registerTimerListeners = (
  startCallback: () => void,
  pauseCallback: () => void,
) => {
  if (!isElectron())
    return { unsubscribeStart: () => {}, unsubscribePause: () => {} };

  const unsubscribeStart = window.electron.onStartTimer(startCallback);
  const unsubscribePause = window.electron.onPauseTimer(pauseCallback);

  return { unsubscribeStart, unsubscribePause };
};

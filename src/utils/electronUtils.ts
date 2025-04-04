import { Settings } from "@/types/electron"; // Import Settings type

export const isElectron = (): boolean => !!window.electron;

// Get settings from the main process
export const getElectronSettings = async (): Promise<Settings> => {
  if (!isElectron()) {
    // Provide default settings if not in Electron environment
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
    // Return default settings on error
    return {
      workDuration: 25 * 60,
      stretchDuration: 5 * 60,
      startMinimized: false,
      runAtStartup: false,
    };
  }
};

// Save settings to the main process
export const saveElectronSettings = async (settings: Partial<Settings>): Promise<boolean> => {
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

export const showNativeNotification = (
  title: string,
  body: string,
) => {
  if (!isElectron()) return;
  // Ensure options object is passed correctly
  window.electron.showNotification({ title, body }); 
};

export const showMainWindow = () => {
  if (!isElectron()) return;
  window.electron.showWindow();
};

// Type definition for the callback function
type TimerCallback = () => void;

// Type definition for the unsubscribe function returned by registerTimerListeners
type UnsubscribeFunction = () => void;

// Register listeners for timer events from main process
export const registerTimerListeners = (
  onStart: TimerCallback,
  onPause: TimerCallback,
): UnsubscribeFunction => {
  if (!isElectron()) {
    return () => {}; // Return a no-op function if not in Electron
  }

  const unsubscribeStart = window.electron.onStartTimer(onStart);
  const unsubscribePause = window.electron.onPauseTimer(onPause);

  // Return a function that unsubscribes both listeners
  return () => {
    unsubscribeStart();
    unsubscribePause();
  };
};

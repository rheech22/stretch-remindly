import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { toast } from "@/components/ui/use-toast";
import { Settings } from "@/types/electron";
import {
  isElectron,
  getElectronSettings,
  saveElectronSettings,
  showNativeNotification,
  registerTimerListeners,
  showMainWindow,
} from "@/utils/electronUtils";

type TimerContextType = {
  workDuration: number;
  setWorkDuration: (minutes: number) => void;
  stretchDuration: number;
  setStretchDuration: (minutes: number) => void;
  remainingTime: number;
  isRunning: boolean;
  isStretching: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  snoozeTimer: (minutes: number) => void;
  skipToStretching: () => void;
  completeStretching: () => void;
  progress: number;
};

const defaultWorkDuration = 1;
const defaultStretchDuration = 1;

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [workDuration, setWorkDurationState] = useState<number>(
    defaultWorkDuration * 60,
  );
  const [stretchDuration, setStretchDurationState] = useState<number>(
    defaultStretchDuration * 60,
  );
  const [remainingTime, setRemainingTime] = useState<number>(workDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isStretching, setIsStretching] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Function to load settings and initialize state
  const initializeSettings = useCallback(async () => {
    if (isElectron()) {
      const loadedSettings = await getElectronSettings();
      console.log("Loaded settings in context:", loadedSettings);
      setWorkDurationState(loadedSettings.workDuration);
      setStretchDurationState(loadedSettings.stretchDuration);
      // Set initial remaining time based on loaded work duration
      // Only reset if timer is not currently running to avoid disrupting active session
      if (!isRunning) {
        setRemainingTime(loadedSettings.workDuration);
        setProgress(0); // Reset progress as well
      }
    }
  }, [isRunning]); // Depend on isRunning to avoid resetting active timer

  // Load settings when the component mounts
  useEffect(() => {
    initializeSettings();
  }, [initializeSettings]);

  // Update remaining time when workDuration changes (and timer isn't running)
  useEffect(() => {
    if (!isRunning) {
      setRemainingTime(workDuration);
      setProgress(0); // Ensure progress resets too
    }
  }, [workDuration, isRunning]);

  // Function to save settings (used by setters)
  const saveSettings = useCallback(async (newSettings: Partial<Settings>) => {
    if (isElectron()) {
      await saveElectronSettings(newSettings);
    }
  }, []);

  // Setter for work duration that also saves
  const setWorkDuration = useCallback(
    (minutes: number) => {
      setWorkDurationState(minutes * 60);
      saveSettings({ workDuration: minutes * 60 });
    },
    [saveSettings],
  );

  // Setter for stretch duration that also saves
  const setStretchDuration = useCallback(
    (minutes: number) => {
      setStretchDurationState(minutes * 60);
      saveSettings({ stretchDuration: minutes * 60 });
    },
    [saveSettings],
  );

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Register system tray timer controls
  useEffect(() => {
    let unsubscribe = () => {}; // Initialize with a no-op function
    if (isElectron()) {
      // registerTimerListeners now returns a single unsubscribe function
      unsubscribe = registerTimerListeners(startTimer, pauseTimer);
    }

    // Cleanup function for useEffect
    return () => {
      unsubscribe(); // Call the single unsubscribe function
    };
  }, [startTimer, pauseTimer]); // Dependencies: startTimer and pauseTimer callbacks

  // Reset timer when duration changes
  useEffect(() => {
    if (!isRunning) {
      if (!isStretching) {
        setRemainingTime(workDuration);
      } else {
        setRemainingTime(stretchDuration);
      }
    }
  }, [workDuration, stretchDuration, isRunning, isStretching]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && remainingTime > 0) {
      interval = window.setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = prevTime - 1;

          // Calculate progress percentage
          const totalDuration = isStretching ? stretchDuration : workDuration;
          const newProgress = ((totalDuration - newTime) / totalDuration) * 100;
          setProgress(newProgress);

          return newTime;
        });
      }, 1000);
    } else if (remainingTime === 0) {
      if (!isStretching) {
        // Work timer completed, notify user to stretch
        toast({
          title: "Time to stretch!",
          description:
            "Your work session is complete. Let's do some stretching!",
          duration: 10000,
        });

        // Show native notification and bring window to front if in Electron
        if (isElectron()) {
          showNativeNotification(
            "Time to stretch!",
            "Your work session is complete. Let's do some stretching!",
          );
          showMainWindow();
        }

        setIsStretching(true);
        setRemainingTime(stretchDuration);
        setProgress(0);
      } else {
        // Stretching completed, reset to work timer
        toast({
          title: "Stretching complete!",
          description: "Great job! Your work timer is restarting.",
          duration: 5000,
        });

        // Show native notification if in Electron
        if (isElectron()) {
          showNativeNotification(
            "Stretching complete!",
            "Great job! Your work timer is restarting.",
          );
          // Optionally, show window when stretching is complete too, if desired
          // showMainWindow();
        }

        setIsStretching(false);
        setRemainingTime(workDuration);
        setProgress(0);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, remainingTime, isStretching, stretchDuration, workDuration]);

  const resetTimer = () => {
    setIsRunning(false);
    setIsStretching(false);
    setRemainingTime(workDuration);
    setProgress(0);
  };

  const snoozeTimer = (minutes: number) => {
    setIsRunning(false);
    setRemainingTime(minutes * 60);
    setIsStretching(false);
    setIsRunning(true);
    toast({
      title: "Timer snoozed",
      description: `Reminder snoozed for ${minutes} minutes.`,
    });
  };

  const skipToStretching = () => {
    setIsStretching(true);
    setRemainingTime(stretchDuration);
    setProgress(0);
    setIsRunning(true);
  };

  const completeStretching = () => {
    setIsStretching(false);
    setRemainingTime(workDuration);
    setProgress(0);
    setIsRunning(true);
    toast({
      title: "Stretching complete!",
      description: "Great job! Your work timer is restarting.",
    });
  };

  return (
    <TimerContext.Provider
      value={{
        workDuration: workDuration / 60,
        setWorkDuration,
        stretchDuration: stretchDuration / 60,
        setStretchDuration,
        remainingTime,
        isRunning,
        isStretching,
        startTimer,
        pauseTimer,
        resetTimer,
        snoozeTimer,
        skipToStretching,
        completeStretching,
        progress,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

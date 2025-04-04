import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
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

const defaultWorkDuration = 45; // 45 minutes
const defaultStretchDuration = 5; // 5 minutes

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [workDuration, setWorkDuration] = useState(defaultWorkDuration);
  const [stretchDuration, setStretchDuration] = useState(
    defaultStretchDuration,
  );
  const [remainingTime, setRemainingTime] = useState(workDuration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isStretching, setIsStretching] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load settings from Electron if available
  useEffect(() => {
    const loadSettings = async () => {
      if (isElectron()) {
        const settings = await getElectronSettings();
        if (settings) {
          setWorkDuration(settings.workDuration);
          setStretchDuration(settings.stretchDuration);
        }
      }
    };

    loadSettings();
  }, []);

  // Save settings to Electron when they change
  useEffect(() => {
    const saveSettings = async () => {
      if (isElectron()) {
        await saveElectronSettings({
          workDuration,
          stretchDuration,
        });
      }
    };

    saveSettings();
  }, [workDuration, stretchDuration]);

  // Register system tray timer controls
  useEffect(() => {
    if (isElectron()) {
      const { unsubscribeStart, unsubscribePause } = registerTimerListeners(
        startTimer,
        pauseTimer,
      );

      return () => {
        unsubscribeStart();
        unsubscribePause();
      };
    }
  }, []);

  // Reset timer when duration changes
  useEffect(() => {
    if (!isRunning) {
      if (!isStretching) {
        setRemainingTime(workDuration * 60);
      } else {
        setRemainingTime(stretchDuration * 60);
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
          const totalDuration = isStretching
            ? stretchDuration * 60
            : workDuration * 60;
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
        setRemainingTime(stretchDuration * 60);
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
        setRemainingTime(workDuration * 60);
        setProgress(0);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, remainingTime, isStretching, stretchDuration, workDuration]);

  const startTimer = () => setIsRunning(true);

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setIsStretching(false);
    setRemainingTime(workDuration * 60);
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
    setRemainingTime(stretchDuration * 60);
    setProgress(0);
    setIsRunning(true);
  };

  const completeStretching = () => {
    setIsStretching(false);
    setRemainingTime(workDuration * 60);
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
        workDuration,
        setWorkDuration,
        stretchDuration,
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

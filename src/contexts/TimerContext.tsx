
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

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

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workDuration, setWorkDuration] = useState(defaultWorkDuration);
  const [stretchDuration, setStretchDuration] = useState(defaultStretchDuration);
  const [remainingTime, setRemainingTime] = useState(workDuration * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isStretching, setIsStretching] = useState(false);
  const [progress, setProgress] = useState(0);

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
          const totalDuration = isStretching ? stretchDuration * 60 : workDuration * 60;
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
          description: "Your work session is complete. Let's do some stretching!",
          duration: 10000,
        });
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
        progress
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};

import React from "react";
import { useTimer } from "@/contexts/TimerContext";

const TimerDisplay: React.FC = () => {
  const {
    remainingTime,
    isStretching,
  } = useTimer();

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center no-drag">
      {/* Cyberpunk title with glowing effect */}
      <h1 className="text-3xl font-bold mb-2 text-center font-['Orbitron'] tracking-wider">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary">
          STRETCH REMINDLY
        </span>
      </h1>
      
      {/* Status indicator */}
      <div className="mb-6">
        <span className={`
          inline-block px-4 py-1 rounded-full text-xs uppercase tracking-widest font-bold
          ${isStretching 
            ? "bg-accent text-accent-foreground animate-pulse" 
            : "bg-secondary text-secondary-foreground animate-pulse"}
          border border-white/20 shadow-lg
        `}>
          {isStretching ? "STRETCH TIME" : "WORK TIME"}
        </span>
      </div>

      {/* Timer display with cyberpunk styling */}
      <div className={`
        relative w-64 h-64 rounded-full flex items-center justify-center
        ${isStretching 
          ? "bg-accent/10 border-accent/50" 
          : "bg-secondary/10 border-secondary/50"}
        border-4 shadow-lg
        before:content-[''] before:absolute before:inset-0 before:rounded-full 
        before:border-4 before:border-t-transparent before:border-l-transparent
        ${isStretching 
          ? "before:border-r-accent before:border-b-accent" 
          : "before:border-r-secondary before:border-b-secondary"}
        before:animate-slow-spin
      `}>
        {/* Inner circle with time */}
        <div className={`
          w-52 h-52 rounded-full flex items-center justify-center
          bg-background border-2
          ${isStretching 
            ? "border-accent/30 text-accent" 
            : "border-secondary/30 text-secondary"}
          shadow-inner
        `}>
          <div className="text-center">
            <div className="font-['Orbitron'] text-5xl font-bold tracking-wider">
              {formatTime(remainingTime)}
            </div>
            <div className="mt-2 text-xs uppercase tracking-widest opacity-70">
              {isStretching ? "stretch" : "until break"}
            </div>
          </div>
        </div>
      </div>

      {/* Motivational text with cyberpunk styling */}
      <p className="mt-6 text-center text-sm text-foreground/70 italic max-w-xs">
        {isStretching 
          ? "Stand up and stretch your body. Your cybernetic enhancements need maintenance." 
          : "Keep working. Optimize your performance. Break incoming."}
      </p>

      {/* Control buttons - moved to TimerControls component */}
    </div>
  );
};

export default TimerDisplay;

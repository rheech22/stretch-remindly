import { useTimer } from "@/contexts/TimerContext";
import { Button } from "./ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";

const TimerControls: React.FC = () => {
  const { isRunning, startTimer, pauseTimer, resetTimer } = useTimer();

  return (
    <div className="flex flex-col items-center space-y-6 no-drag">
      <div className="flex justify-center space-x-4">
        <Button
          onClick={isRunning ? pauseTimer : startTimer}
          className={`
            w-16 h-16 rounded-full 
            ${
              isRunning
                ? "bg-transparent hover:bg-destructive/10"
                : "bg-transparent hover:bg-primary/10"
            }
            ${isRunning ? "text-destructive" : "text-primary"}
            font-bold
            border-2 ${isRunning ? "border-destructive" : "border-primary"}
            shadow-md
            transition-all duration-300 ease-in-out
            flex items-center justify-center
          `}
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </Button>

        {isRunning && (
          <Button
            onClick={resetTimer}
            className="
              w-12 h-12 rounded-full 
              bg-transparent hover:bg-secondary/10
              text-secondary font-bold
              border-2 border-secondary
              shadow-md
              transition-all duration-300 ease-in-out
              flex items-center justify-center
            "
            aria-label="Reset Timer"
          >
            <RefreshCw className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TimerControls;

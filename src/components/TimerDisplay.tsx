import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import { AlarmClock, Play, Pause, RotateCcw } from "lucide-react";

const TimerDisplay: React.FC = () => {
  const {
    remainingTime,
    isRunning,
    isStretching,
    startTimer,
    pauseTimer,
    resetTimer,
    progress,
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
    <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-center">
          <AlarmClock
            className={`h-8 w-8 text-stretch-primary ${
              isRunning ? "animate-pulse-gentle" : ""
            }`}
          />
          <h2 className="text-2xl font-bold ml-2 text-stretch-dark">
            {isStretching ? "Stretching Time" : "Work Timer"}
          </h2>
        </div>

        <div className="text-5xl font-bold text-center my-6 text-stretch-primary">
          {formatTime(remainingTime)}
        </div>

        <Progress
          value={progress}
          className="h-2 mb-6 animate-progress"
          indicatorColor={
            isStretching ? "bg-stretch-success" : "bg-stretch-primary"
          }
        />

        <div className="flex justify-center space-x-4 mt-4">
          <Button
            variant="outline"
            size="icon"
            className="timer-button"
            onClick={resetTimer}
            aria-label="Reset Timer"
          >
            <RotateCcw className="h-5 w-5 text-stretch-neutral" />
          </Button>

          {isRunning ? (
            <Button
              variant="outline"
              size="icon"
              className="timer-button"
              onClick={pauseTimer}
              aria-label="Pause Timer"
            >
              <Pause className="h-5 w-5 text-stretch-danger" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              className="timer-button"
              onClick={startTimer}
              aria-label="Start Timer"
            >
              <Play className="h-5 w-5 text-stretch-success" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerDisplay;

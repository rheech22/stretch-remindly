
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useTimer } from "@/contexts/TimerContext";
import { Label } from "@/components/ui/label";

const TimerSettings: React.FC = () => {
  const {
    workDuration,
    setWorkDuration,
    stretchDuration,
    setStretchDuration,
    isRunning
  } = useTimer();

  const handleWorkDurationChange = (value: number[]) => {
    setWorkDuration(value[0]);
  };

  const handleStretchDurationChange = (value: number[]) => {
    setStretchDuration(value[0]);
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-stretch-dark">Timer Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label htmlFor="work-duration" className="text-sm font-medium">
              Work Duration: {workDuration} minutes
            </Label>
          </div>
          <Slider
            id="work-duration"
            min={15}
            max={120}
            step={5}
            defaultValue={[workDuration]}
            onValueChange={handleWorkDurationChange}
            disabled={isRunning}
            className="[&_[role=slider]]:bg-stretch-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15 min</span>
            <span>120 min</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label htmlFor="stretch-duration" className="text-sm font-medium">
              Stretching Duration: {stretchDuration} minutes
            </Label>
          </div>
          <Slider
            id="stretch-duration"
            min={3}
            max={15}
            step={1}
            defaultValue={[stretchDuration]}
            onValueChange={handleStretchDurationChange}
            disabled={isRunning}
            className="[&_[role=slider]]:bg-stretch-success"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3 min</span>
            <span>15 min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerSettings;

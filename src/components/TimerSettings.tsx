import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useTimer } from "@/contexts/TimerContext";
import { Label } from "@/components/ui/label";
import { isElectron, getElectronSettings, saveElectronSettings } from "@/utils/electronUtils";

const TimerSettings: React.FC = () => {
  const {
    workDuration,
    setWorkDuration,
    stretchDuration,
    setStretchDuration,
    isRunning,
  } = useTimer();

  const [workDurationInput, setWorkDurationInput] = useState<number>(workDuration);
  const [stretchDurationInput, setStretchDurationInput] = useState<number>(stretchDuration);

  useEffect(() => {
    const loadCurrentSettings = async () => {
      if (isElectron()) {
        try {
          const settings = await getElectronSettings();
          setWorkDurationInput(settings.workDuration / 60); // Convert seconds to minutes
          setStretchDurationInput(settings.stretchDuration / 60); // Convert seconds to minutes
        } catch (error) {
          console.error("Failed to load settings in component:", error);
        }
      }
    };
    loadCurrentSettings();
  }, []);

  const handleSave = async () => {
    const newWorkDuration = workDurationInput * 60; // Convert minutes to seconds
    const newStretchDuration = stretchDurationInput * 60; // Convert minutes to seconds

    if (newWorkDuration <= 0 || newStretchDuration <= 0) {
      return;
    }

    const settingsToSave = {
      workDuration: newWorkDuration,
      stretchDuration: newStretchDuration,
    };

    if (isElectron()) {
      try {
        const success = await saveElectronSettings(settingsToSave);
        if (success) {
          setWorkDuration(newWorkDuration / 60);
          setStretchDuration(newStretchDuration / 60);
        }
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    }
  };

  const handleWorkDurationChange = (value: number[]) => {
    setWorkDurationInput(value[0]);
  };

  const handleStretchDurationChange = (value: number[]) => {
    setStretchDurationInput(value[0]);
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg rounded-xl overflow-hidden transition-all hover:shadow-xl mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-stretch-dark">
          Timer Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label htmlFor="work-duration" className="text-sm font-medium">
              Work Duration: {workDurationInput} minutes
            </Label>
          </div>
          <Slider
            id="work-duration"
            min={1}
            max={120}
            step={5}
            defaultValue={[workDurationInput]}
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
              Stretching Duration: {stretchDurationInput} minutes
            </Label>
          </div>
          <Slider
            id="stretch-duration"
            min={1}
            max={15}
            step={1}
            defaultValue={[stretchDurationInput]}
            onValueChange={handleStretchDurationChange}
            disabled={isRunning}
            className="[&_[role=slider]]:bg-stretch-success"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>3 min</span>
            <span>15 min</span>
          </div>
        </div>
        <button onClick={handleSave} className="w-full primary-button mt-4">
          Save Settings
        </button>
      </CardContent>
    </Card>
  );
};

export default TimerSettings;

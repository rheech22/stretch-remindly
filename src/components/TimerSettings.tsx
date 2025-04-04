import React, { useState, useEffect } from "react";
import { useTimer } from "@/contexts/TimerContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  isElectron,
  getElectronSettings,
  saveElectronSettings,
} from "@/utils/electronUtils";
import { Save, Clock, Activity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const TimerSettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    workDuration,
    setWorkDuration,
    stretchDuration,
    setStretchDuration,
    isRunning,
  } = useTimer();

  const [workDurationInput, setWorkDurationInput] =
    useState<number>(workDuration);
  const [stretchDurationInput, setStretchDurationInput] =
    useState<number>(stretchDuration);

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

          // Show success toast
          toast({
            title: "Settings Saved",
            description: "Your timer settings have been updated successfully.",
            variant: "default",
          });

          // Navigate back to main screen
          setTimeout(() => {
            navigate("/");
          }, 500);
        }
      } catch (error) {
        console.error("Error saving settings:", error);
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
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
    <div className="w-full bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl overflow-hidden transition-all hover:border-primary/40 shadow-lg">
      {/* Header with cyberpunk styling */}
      <div className="relative p-4 border-b border-primary/30 bg-gradient-to-r from-background to-background/70">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <h2 className="text-xl font-bold text-foreground pl-3 flex items-center gap-2 font-['Orbitron'] tracking-wide">
          <span className="text-primary">SYS</span>CONFIG
        </h2>
      </div>

      {/* Content with cyberpunk styling */}
      <div className="space-y-8 p-6">
        {/* Work Duration Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="work-duration"
              className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Clock className="h-4 w-4 text-secondary" />
              <span className="text-secondary">Work Duration:</span>
              <span className="text-primary font-['Orbitron'] text-lg ml-1">
                {workDurationInput}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                minutes
              </span>
            </Label>
          </div>

          <div className="relative pt-2 pb-6 no-drag">
            <Slider
              id="work-duration"
              min={1}
              max={120}
              step={1}
              value={[workDurationInput]}
              onValueChange={handleWorkDurationChange}
              disabled={isRunning}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-2 [&_[role=slider]]:border-white/50 [&_[role=slider]]:shadow-glow [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:hover:bg-primary/80 [&_[role=slider]]:transition-all [&_[role=slider]]:duration-300"
            />
            <div className="absolute -bottom-1 left-0 right-0 flex justify-between text-xs text-muted-foreground font-mono">
              <span>1</span>
              <span>15</span>
              <span>30</span>
              <span>60</span>
              <span>120</span>
            </div>
          </div>
        </div>

        {/* Stretch Duration Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="stretch-duration"
              className="text-sm font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Activity className="h-4 w-4 text-accent" />
              <span className="text-accent">Stretch Duration:</span>
              <span className="text-primary font-['Orbitron'] text-lg ml-1">
                {stretchDurationInput}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                minutes
              </span>
            </Label>
          </div>

          <div className="relative pt-2 pb-6 no-drag">
            <Slider
              id="stretch-duration"
              min={1}
              max={15}
              step={1}
              value={[stretchDurationInput]}
              onValueChange={handleStretchDurationChange}
              disabled={isRunning}
              className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-2 [&_[role=slider]]:border-white/50 [&_[role=slider]]:shadow-glow [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:hover:bg-accent/80 [&_[role=slider]]:transition-all [&_[role=slider]]:duration-300"
            />
            <div className="absolute -bottom-1 left-0 right-0 flex justify-between text-xs text-muted-foreground font-mono">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
            </div>
          </div>
        </div>

        {/* Save Button with cyberpunk styling */}
        <Button
          onClick={handleSave}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-md border border-white/20 shadow-md transition-all duration-300 uppercase tracking-wider font-['Orbitron'] group no-drag"
          disabled={isRunning}
        >
          <Save className="mr-2 h-4 w-4 group-hover:animate-pulse" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default TimerSettings;


import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTimer } from "@/contexts/TimerContext";
import { ChevronRight, ChevronLeft, Zap } from "lucide-react";

const stretchingExercises = [
  {
    name: "Neck Stretches",
    description: "Gently tilt your head toward each shoulder, holding for 5 seconds.",
    imagePath: "/neck-stretch.svg" // Placeholder, not actually using images in this version
  },
  {
    name: "Shoulder Rolls",
    description: "Roll your shoulders backward and forward in a circular motion.",
    imagePath: "/shoulder-roll.svg"
  },
  {
    name: "Wrist and Finger Stretches",
    description: "Extend your arm, gently pull fingers back, then down. Repeat with each hand.",
    imagePath: "/wrist-stretch.svg"
  },
  {
    name: "Seated Spinal Twist",
    description: "Sit straight, place your right hand on your left knee, twist to the left. Repeat on the other side.",
    imagePath: "/spinal-twist.svg"
  },
  {
    name: "Arm and Shoulder Stretch",
    description: "Raise one arm overhead, bend elbow, reach down back. Use other hand to gently pull elbow. Repeat on other arm.",
    imagePath: "/arm-stretch.svg"
  }
];

const StretchingGuide: React.FC = () => {
  const { remainingTime, isStretching, progress, completeStretching } = useTimer();
  
  // Calculate which exercise to show based on the progress
  const exerciseIndex = Math.min(
    Math.floor(progress / 20), // 5 exercises, each taking 20% of time
    stretchingExercises.length - 1
  );
  
  const currentExercise = stretchingExercises[exerciseIndex];
  
  if (!isStretching) {
    return null;
  }
  
  return (
    <div className="w-full">
      {/* Exercise Progress Indicator */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Zap className="h-5 w-5 text-accent mr-2" />
          <span className="text-muted-foreground font-mono text-sm">
            EXERCISE <span className="text-accent font-['Orbitron']">{exerciseIndex + 1}</span> / {stretchingExercises.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-card/50 border border-accent/20 hover:bg-card/70 hover:border-accent/40"
            disabled={exerciseIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 text-accent" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-card/50 border border-accent/20 hover:bg-card/70 hover:border-accent/40"
            disabled={exerciseIndex === stretchingExercises.length - 1}
          >
            <ChevronRight className="h-4 w-4 text-accent" />
          </Button>
        </div>
      </div>
      
      {/* Main Exercise Card */}
      <div className="relative bg-card/30 backdrop-blur-sm border border-accent/30 rounded-xl overflow-hidden shadow-lg">
        {/* Glowing border effect */}
        <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
        
        {/* Exercise Header */}
        <div className="p-6 border-b border-accent/20">
          <h3 className="text-2xl font-bold mb-2 font-['Orbitron'] tracking-wide text-white">
            <span className="text-accent">&gt;</span> {currentExercise.name}
          </h3>
          
          <Progress 
            value={progress % 20 * 5} 
            className="h-1.5 mt-4" 
            style={{
              background: 'rgba(255,255,255,0.1)',
            }}
          />
        </div>
        
        {/* Exercise Content */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {currentExercise.description}
              </p>
              
              {/* Cyberpunk-styled tips */}
              <div className="bg-card/50 border border-accent/20 rounded-md p-4 mb-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-2 flex items-center">
                  <Zap className="h-4 w-4 mr-1" /> OPTIMIZATION TIP
                </h4>
                <p className="text-xs text-muted-foreground">
                  Perform this stretch slowly and mindfully. Focus on your breathing to maximize effectiveness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StretchingGuide;

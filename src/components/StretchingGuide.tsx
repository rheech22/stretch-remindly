
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTimer } from "@/contexts/TimerContext";

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
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden border-t-4 border-stretch-success mb-4">
      <CardHeader className="bg-stretch-light">
        <CardTitle className="text-xl text-center text-stretch-dark">
          Time to Stretch! ({Math.ceil(remainingTime / 60)} min left)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-stretch-primary">
          {currentExercise.name}
        </h3>
        
        <p className="text-gray-700 mb-4">
          {currentExercise.description}
        </p>
        
        <div className="mb-2 text-sm text-right text-stretch-neutral">
          Exercise {exerciseIndex + 1} of {stretchingExercises.length}
        </div>
        
        <Progress 
          value={progress % 20 * 5} 
          className="h-2 mb-6" 
          indicatorClassName="bg-stretch-success animate-progress"
        />
      </CardContent>
      
      <CardFooter className="flex justify-end bg-gray-50 p-4">
        <Button 
          onClick={completeStretching}
          className="bg-stretch-primary hover:bg-stretch-secondary"
        >
          Finish Stretching
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StretchingGuide;

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/contexts/TimerContext";

const StretchNotification: React.FC = () => {
  const { isStretching, remainingTime, skipToStretching, snoozeTimer } =
    useTimer();

  // Only show notification when work timer reaches 0 but stretching hasn't started yet
  if (remainingTime > 0 || isStretching) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden border-l-4 border-stretch-primary animate-fade-in mb-4">
      <CardHeader className="bg-stretch-light pb-2">
        <CardTitle className="text-xl text-stretch-dark flex items-center">
          <span className="animation-wave inline-block mr-2">👋</span> Time for
          a stretch break!
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <p className="text-gray-700 mb-4">
          Taking regular stretch breaks helps prevent repetitive strain injuries
          and improves your focus and productivity.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 justify-between mt-4 no-drag">
          <div className="space-y-2">
            <p className="text-sm font-medium text-stretch-neutral">
              Snooze for:
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => snoozeTimer(5)}
                className="text-xs"
              >
                5 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => snoozeTimer(10)}
                className="text-xs"
              >
                10 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => snoozeTimer(15)}
                className="text-xs"
              >
                15 min
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end bg-gray-50 p-4">
        <Button
          onClick={skipToStretching}
          className="bg-stretch-primary hover:bg-stretch-secondary"
        >
          Start Stretching Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StretchNotification;

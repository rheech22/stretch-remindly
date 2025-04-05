import { useTimer } from "@/contexts/TimerContext";
import TimerDisplay from "@/components/TimerDisplay";
import TimerControls from "../components/TimerControls";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { changeWindowHeight } from "@/utils/electronUtils";

const Index = () => {
  const { isStretching, isRunning } = useTimer();
  const navigate = useNavigate();

  useEffect(() => {
    if (isStretching) {
      navigate("/stretching");
      changeWindowHeight(1200);
    }
  }, [isStretching, navigate]);

  return (
    <div className="flex flex-col items-center min-h-full justify-center p-8 pt-[80px] space-y-12">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <TimerDisplay />
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-xs mx-auto">
        <TimerControls />
      </div>

      {!isRunning && (
        <div className="absolute bottom-4 right-4 no-drag">
          <Button
            onClick={() => navigate("/settings")}
            variant="ghost"
            size="icon"
            className="rounded-full w-12 h-12 border border-primary/30 hover:border-primary/60 transition-all duration-300 bg-transparent hover:bg-primary/10"
          >
            <Settings className="h-6 w-6 text-primary" />
          </Button>
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        <p className="tracking-wide">
          © 2025 <span className="text-accent">STRETCH_REMINDLY</span> //
          HEALTH_OPTIMIZATION_SYSTEM
        </p>
      </footer>
    </div>
  );
};

export default Index;

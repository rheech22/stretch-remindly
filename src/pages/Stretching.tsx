import StretchingGuide from "@/components/StretchingGuide";
import { useTimer } from "@/contexts/TimerContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const StretchingPage = () => {
  const { isStretching, completeStretching, remainingTime } = useTimer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isStretching) {
      navigate("/");
    }
  }, [isStretching, navigate]);

  const handleFinishStretching = () => {
    if (completeStretching) {
      completeStretching();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background via-background/95 to-background/90 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-accent/30 animate-pulse-glow-secondary"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <header className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Activity className="h-8 w-8 text-accent animate-pulse" />
            <h1 className="text-4xl font-bold font-['Orbitron'] tracking-wider text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent via-white to-primary">
                STRETCH_MODE
              </span>
            </h1>
          </div>
          <p className="text-center text-muted-foreground font-mono tracking-wide">
            REMAINING:{" "}
            <span className="text-accent font-['Orbitron']">
              {Math.floor(remainingTime / 60)}:
              {remainingTime % 60 < 10 ? "0" : ""}
              {remainingTime % 60}
            </span>
          </p>
          <div className="h-1 w-48 bg-gradient-to-r from-accent to-primary mx-auto mt-4"></div>
        </header>

        <div className="bg-card/30 backdrop-blur-md border border-accent/30 rounded-xl p-6 shadow-lg">
          <StretchingGuide />
        </div>

        <div className="mt-8 flex justify-center no-drag">
          <Button
            onClick={handleFinishStretching}
            className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-6 rounded-md border border-white/20 shadow-md transition-all duration-300 uppercase tracking-wider font-['Orbitron']"
          >
            COMPLETE STRETCHING
          </Button>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p className="tracking-wide">
            © 2025 <span className="text-accent">STRETCH_REMINDLY</span> //
            HEALTH_OPTIMIZATION_SYSTEM
          </p>
        </footer>
      </div>
    </div>
  );
};

export default StretchingPage;

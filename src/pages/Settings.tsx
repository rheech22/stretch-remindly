import { useNavigate } from "react-router-dom";
import TimerSettings from "@/components/TimerSettings";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8 bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="absolute top-12 left-4 no-drag">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="icon"
          className="rounded-full w-12 h-12 bg-transparent border border-primary/30 hover:border-primary/60 transition-all duration-300 hover:bg-primary/10"
        >
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
      </div>

      <div className="w-full max-w-lg mt-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-['Orbitron'] tracking-wider text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary">
              SYSTEM SETTINGS
            </span>
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary mx-auto mt-2"></div>
        </header>
        <TimerSettings />
      </div>

      <footer className="mt-12 text-center text-xs text-muted-foreground">
        <p className="tracking-wide">
          © 2025 <span className="text-accent">STRETCH_REMINDLY</span> //
          HEALTH_OPTIMIZATION_SYSTEM
        </p>
      </footer>
    </div>
  );
};

export default SettingsPage;

import { useTimer } from "@/contexts/TimerContext"; // Removed TimerProvider, only useTimer remains
import TimerDisplay from "@/components/TimerDisplay";
import StretchNotification from "@/components/StretchNotification";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Merged IndexContent into Index component
const Index = () => {
  const { isStretching } = useTimer();
  const navigate = useNavigate();

  useEffect(() => {
    if (isStretching) {
      navigate('/stretching');
    }
  }, [isStretching, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-stretch-light p-4">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stretch-primary mb-2">
            Stretch Remindly
          </h1>
          <p className="text-stretch-neutral">
            Create a healthy work routine with regular stretching
          </p>
        </header>

        <StretchNotification />
        <TimerDisplay />
        
        {/* Added link to settings page */}
        <div className="mt-4 text-center">
          <Link to="/settings" className="text-stretch-primary hover:underline">
            Settings
          </Link>
        </div>

        <footer className="mt-8 text-center text-sm text-stretch-neutral">
          <p> 2025 Stretch Remindly - We care about your health</p>
        </footer>
      </div>
    </div>
  );
};

// Removed the TimerProvider wrapping part

export default Index;
import StretchingGuide from '@/components/StretchingGuide';
import { useTimer } from '@/contexts/TimerContext'; // Import useTimer
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useEffect } from 'react'; // Import useEffect

const StretchingPage = () => {
  const { isStretching, completeStretching } = useTimer(); // Get isStretching and completeStretching
  const navigate = useNavigate(); // Use navigate hook

  // Automatically navigate back to timer when stretching is finished
  useEffect(() => {
    if (!isStretching) {
      navigate('/');
    }
  }, [isStretching, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-stretch-light p-4">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stretch-primary mb-2">
            Stretching Time!
          </h1>
        </header>

        <StretchingGuide />

        <footer className="mt-8 text-center text-sm text-stretch-neutral">
          <p> 2025 Stretch Remindly - We care about your health</p>
        </footer>
      </div>
    </div>
  );
};

export default StretchingPage;

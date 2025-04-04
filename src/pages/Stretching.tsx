import StretchingGuide from '@/components/StretchingGuide';
import { useTimer } from '@/contexts/TimerContext'; // Import useTimer
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StretchingPage = () => {
  const { completeStretching } = useTimer(); // Get completeStretching
  const navigate = useNavigate(); // Use navigate hook

  // TODO: Need to modify the logic below after implementing the actual stretching completion logic
  // Example: Logic to automatically return to the timer screen after 5 seconds
  // Call completeStretching function and navigate to main when the button is clicked
  const handleFinishStretching = () => {
    completeStretching();
    navigate('/'); // Navigate to the main screen
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-stretch-light p-4">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stretch-primary mb-2">
            Stretching Time!
          </h1>
        </header>

        <StretchingGuide />

        <div className="mt-8 text-center">
          <button 
            onClick={handleFinishStretching}
            className="px-4 py-2 bg-stretch-primary text-white rounded hover:bg-stretch-dark"
          >
            Finish Stretching
          </button>
        </div>

        <footer className="mt-8 text-center text-sm text-stretch-neutral">
          <p> 2023 Stretch Remindly - We care about your health</p>
        </footer>
      </div>
    </div>
  );
};

export default StretchingPage;

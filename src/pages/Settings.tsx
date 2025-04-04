import { Link } from 'react-router-dom';
import TimerSettings from '@/components/TimerSettings';

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-stretch-light p-4">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-stretch-primary mb-2">
            Settings
          </h1>
        </header>

        <TimerSettings />

        <div className="mt-8 text-center">
          <Link to="/" className="text-stretch-primary hover:underline">
            Go back to the timer screen
          </Link>
        </div>

        <footer className="mt-8 text-center text-sm text-stretch-neutral">
          <p> 2023 Stretch Reminder - We care about your health</p>
        </footer>
      </div>
    </div>
  );
};

export default SettingsPage;

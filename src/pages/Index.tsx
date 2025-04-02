
import React from "react";
import { TimerProvider } from "@/contexts/TimerContext";
import TimerDisplay from "@/components/TimerDisplay";
import TimerSettings from "@/components/TimerSettings";
import StretchingGuide from "@/components/StretchingGuide";
import StretchNotification from "@/components/StretchNotification";

const Index = () => {
  return (
    <TimerProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-stretch-light p-4">
        <div className="w-full max-w-md">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-stretch-primary mb-2">스트레치 리마인더</h1>
            <p className="text-stretch-neutral">정기적인 스트레칭으로 건강한 작업 루틴을 만드세요</p>
          </header>
          
          <StretchingGuide />
          <StretchNotification />
          <TimerDisplay />
          <TimerSettings />
          
          <footer className="mt-8 text-center text-sm text-stretch-neutral">
            <p>© 2023 스트레치 리마인더 - 당신의 건강을 생각합니다</p>
          </footer>
        </div>
      </div>
    </TimerProvider>
  );
};

export default Index;

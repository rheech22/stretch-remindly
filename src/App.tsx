import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Stretching from "./pages/Stretching";
import NotFound from "./pages/NotFound";
import TitleBar from "./components/TitleBar";
import React from "react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Toast notifications */}
      <Toaster />
      <Sonner />
      <div className="flex flex-col h-screen bg-background text-foreground font-sans antialiased overflow-hidden app-drag-region">
        {/* Custom Title Bar for frameless window */}
        <TitleBar />

        {/* Main content area - with cyberpunk styling */}
        <main className="flex-grow flex flex-col items-center justify-center p-8 space-y-8 bg-gradient-to-b from-background via-background/95 to-background/90">
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/stretching" element={<Stretching />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </main>

        {/* Settings Footer Area - fixed at the bottom with cyberpunk styling */}
        <footer className="p-4 border-t border-primary/30 bg-card/30 backdrop-blur-md">
          {/* Add settings component here if needed */}
        </footer>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

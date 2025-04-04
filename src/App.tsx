// App.tsx (Relevant part)
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Stretching from "./pages/Stretching";
import NotFound from "./pages/NotFound";
import TitleBar from "./components/TitleBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* ...Toaster components */}
      <Toaster />
      <Sonner />
      <div className="flex flex-col h-screen bg-background text-foreground font-sans antialiased overflow-hidden app-drag-region">
        {/* Custom Title Bar for frameless window */}
        <TitleBar />

        {/* Main content area - with cyberpunk styling */}
        {/* Increased opacity for the via color in the gradient */}
        <main className="flex-grow flex flex-col items-center justify-center p-8 space-y-8 bg-gradient-to-b from-background via-secondary to-background">
          {" "}
          {/* <-- Changed via-secondary/5 to via-secondary/20 */}
          <HashRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/stretching" element={<Stretching />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </main>

        {/* Settings Footer Area - enhanced cyberpunk styling */}
        <footer className="p-4 border-t border-primary/30 bg-card/50 backdrop-blur-lg">
          {/* Add settings component here if needed */}
        </footer>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

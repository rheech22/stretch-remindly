import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import Stretching from "./pages/Stretching";
import NotFound from "./pages/NotFound";
import { TimerProvider } from "./contexts/TimerContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TimerProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/stretching" element={<Stretching />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TimerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

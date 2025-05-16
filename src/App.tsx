
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* These routes would be implemented later */}
          <Route path="/teams" element={<NotFound />} />
          <Route path="/matches" element={<NotFound />} />
          <Route path="/analysis" element={<NotFound />} />
          <Route path="/patterns" element={<NotFound />} />
          <Route path="/statistics" element={<NotFound />} />
          <Route path="/league-management" element={<NotFound />} />
          <Route path="/settings" element={<NotFound />} />
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

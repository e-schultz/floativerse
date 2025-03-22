
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NoteEditor from "./pages/NoteEditor";
import RecentNotes from "./pages/RecentNotes";
import ExploreNotes from "./pages/ExploreNotes";
import Auth from "./pages/Auth";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/note/editor" element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            } />
            <Route path="/note/editor/:id" element={
              <ProtectedRoute>
                <NoteEditor />
              </ProtectedRoute>
            } />
            <Route path="/recent-notes" element={
              <ProtectedRoute>
                <RecentNotes />
              </ProtectedRoute>
            } />
            <Route path="/explore-notes" element={
              <ProtectedRoute>
                <ExploreNotes />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

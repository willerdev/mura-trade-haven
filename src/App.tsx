import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import Trade from "./pages/Trade";
import Positions from "./pages/Positions";
import Account from "./pages/Account";
import MobileNavigation from "./components/MobileNavigation";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  console.log("App component rendered");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/markets" 
                element={
                  <ProtectedRoute>
                    <Markets />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trade" 
                element={
                  <ProtectedRoute>
                    <Trade />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/positions" 
                element={
                  <ProtectedRoute>
                    <Positions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <MobileNavigation />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
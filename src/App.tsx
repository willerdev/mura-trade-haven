import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    // Redirect to login if not authenticated
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
                path="/deposit" 
                element={
                  <ProtectedRoute>
                    <Deposit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/withdraw" 
                element={
                  <ProtectedRoute>
                    <Withdraw />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
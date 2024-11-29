import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from '@/components/ThemeProvider';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    console.log("DashboardLayout mounted, user:", user);
    console.log("Current location:", location.pathname);
    
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate('/login');
    }
  }, [user, navigate, location]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="glass border-b h-16 fixed top-0 w-full z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">MuraTrade</h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="mr-2"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Button variant="ghost" onClick={() => handleNavigation('/dashboard')}>Home</Button>
                  <Button variant="ghost" onClick={() => handleNavigation('/markets')}>Markets</Button>
                  <Button variant="ghost" onClick={() => handleNavigation('/trade')}>Trade</Button>
                  <Button variant="ghost" onClick={() => handleNavigation('/positions')}>Positions</Button>
                  <Button variant="ghost" onClick={() => handleNavigation('/account')}>Account</Button>
                  <Button variant="outline" onClick={logout}>Logout</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => handleNavigation('/dashboard')}>Home</Button>
            <Button variant="ghost" onClick={() => handleNavigation('/markets')}>Markets</Button>
            <Button variant="ghost" onClick={() => handleNavigation('/trade')}>Trade</Button>
            <Button variant="ghost" onClick={() => handleNavigation('/positions')}>Positions</Button>
            <Button variant="ghost" onClick={() => handleNavigation('/account')}>Account</Button>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </nav>

      <div className="pt-16 h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
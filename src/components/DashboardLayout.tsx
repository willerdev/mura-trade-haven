import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from '@/components/ThemeProvider';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Add effect to check authentication
  useEffect(() => {
    console.log("DashboardLayout mounted, user:", user);
  }, [user]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="glass border-b h-16 fixed top-0 w-full z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">MuraTrade</h1>
          </div>
          
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="mr-2"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <Button variant="ghost" onClick={() => navigate('/dashboard')}>Home</Button>
                  <Button variant="ghost" onClick={() => navigate('/markets')}>Markets</Button>
                  <Button variant="ghost" onClick={() => navigate('/trade')}>Trade</Button>
                  <Button variant="ghost" onClick={() => navigate('/positions')}>Positions</Button>
                  <Button variant="ghost" onClick={() => navigate('/account')}>Account</Button>
                  <Button variant="outline" onClick={logout}>Logout</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Home</Button>
            <Button variant="ghost" onClick={() => navigate('/markets')}>Markets</Button>
            <Button variant="ghost" onClick={() => navigate('/trade')}>Trade</Button>
            <Button variant="ghost" onClick={() => navigate('/positions')}>Positions</Button>
            <Button variant="ghost" onClick={() => navigate('/account')}>Account</Button>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
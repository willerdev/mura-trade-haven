import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="glass border-b h-16 fixed top-0 w-full z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">MuraTrade</h1>
          </div>
          
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
                  <Button variant="ghost" onClick={() => navigate('/dashboard/deposit')}>Deposit</Button>
                  <Button variant="ghost" onClick={() => navigate('/dashboard/withdraw')}>Withdraw</Button>
                  <Button variant="outline" onClick={logout}>Logout</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>Home</Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard/deposit')}>Deposit</Button>
            <Button variant="ghost" onClick={() => navigate('/dashboard/withdraw')}>Withdraw</Button>
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
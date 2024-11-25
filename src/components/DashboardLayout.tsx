import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="glass border-b h-16 fixed top-0 w-full z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">MuraTrade</h1>
          </div>
          <div className="flex items-center space-x-4">
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
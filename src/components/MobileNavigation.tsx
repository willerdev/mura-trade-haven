import { Link, useLocation } from 'react-router-dom';
import { Home, LineChart, BarChart2, Layout, User } from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around z-50">
      <Link to="/dashboard" className={`flex flex-col items-center ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Hub</span>
      </Link>
      <Link to="/markets" className={`flex flex-col items-center ${isActive('/markets') ? 'text-primary' : 'text-muted-foreground'}`}>
        <LineChart className="h-5 w-5" />
        <span className="text-xs mt-1">Markets</span>
      </Link>
      <Link to="/trade" className={`flex flex-col items-center ${isActive('/trade') ? 'text-primary' : 'text-muted-foreground'}`}>
        <BarChart2 className="h-5 w-5" />
        <span className="text-xs mt-1">Trade</span>
      </Link>
      <Link to="/positions" className={`flex flex-col items-center ${isActive('/positions') ? 'text-primary' : 'text-muted-foreground'}`}>
        <Layout className="h-5 w-5" />
        <span className="text-xs mt-1">Position</span>
      </Link>
      <Link to="/account" className={`flex flex-col items-center ${isActive('/account') ? 'text-primary' : 'text-muted-foreground'}`}>
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Account</span>
      </Link>
    </div>
  );
};

export default MobileNavigation;
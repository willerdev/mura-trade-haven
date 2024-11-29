import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';

const Account = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const menuItems = [
    {
      title: 'Cashier',
      items: [
        { label: 'Deposit', onClick: () => setDepositModalOpen(true) },
        { label: 'Withdraw', onClick: () => setWithdrawModalOpen(true) },
      ]
    },
    {
      title: 'Settings',
      items: [
        { label: 'Account Settings', onClick: () => navigate('/settings') },
        { label: 'Help & Support', onClick: () => navigate('/support') },
      ]
    },
    {
      title: 'Legal',
      items: [
        { label: 'Terms & Conditions', onClick: () => navigate('/terms') },
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-4 pb-20 md:pb-4">
        <h1 className="text-2xl font-bold mb-4">Account</h1>
        
        {menuItems.map((section) => (
          <Card key={section.title} className="mb-4 overflow-hidden">
            <h2 className="p-4 font-semibold border-b">{section.title}</h2>
            <div className="divide-y">
              {section.items.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start rounded-none h-12"
                  onClick={item.onClick}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </Card>
        ))}

        <Button 
          variant="destructive" 
          className="w-full mt-4"
          onClick={logout}
        >
          Logout
        </Button>

        <DepositModal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          accountType="live"
        />
        <WithdrawModal
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          accountType="live"
        />
      </div>
    </DashboardLayout>
  );
};

export default Account;
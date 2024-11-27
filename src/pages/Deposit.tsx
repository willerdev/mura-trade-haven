import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement deposit logic
    toast({
      title: "Deposit Initiated",
      description: `Your deposit request for $${amount} has been initiated.`,
    });
    // Optionally navigate back to dashboard after successful deposit
    // navigate('/dashboard');
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (USD)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
            <Button 
              type="submit"
              className="w-full" 
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Deposit
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
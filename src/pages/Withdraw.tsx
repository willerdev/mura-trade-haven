import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleWithdraw = () => {
    // TODO: Implement withdrawal logic
    toast({
      title: "Withdrawal Requested",
      description: `Your withdrawal request for $${amount} has been submitted.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Withdraw Funds</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (USD)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleWithdraw}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Withdraw
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Withdraw;
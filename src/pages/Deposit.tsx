import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

  const handleDeposit = () => {
    // TODO: Implement deposit logic
    toast({
      title: "Deposit Initiated",
      description: `Your deposit request for $${amount} has been initiated.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>
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
              onClick={handleDeposit}
              disabled={!amount || parseFloat(amount) <= 0}
            >
              Deposit
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
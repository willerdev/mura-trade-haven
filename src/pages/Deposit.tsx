import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '../contexts/AuthContext';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('deposits')
        .insert([
          {
            user_id: user?.id,
            amount: parseFloat(amount),
            currency,
            wallet_address: walletAddress,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Deposit Initiated",
        description: `Your deposit request for ${amount} ${currency} has been initiated.`,
      });

      setAmount('');
      setWalletAddress('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to initiate deposit",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-xl mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
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
            
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {currency !== 'USD' && (
              <div>
                <label className="block text-sm font-medium mb-2">Wallet Address</label>
                <Input
                  type="text"
                  placeholder="Enter wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required={currency !== 'USD'}
                />
              </div>
            )}

            <Button 
              type="submit"
              className="w-full" 
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
            >
              {isLoading ? "Processing..." : "Deposit"}
            </Button>

            {currency !== 'USD' && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <h3 className="font-medium mb-2">Important Information:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Only send {currency} to this address</li>
                  <li>Minimum deposit: 0.001 {currency}</li>
                  <li>Processing time: 10-30 minutes</li>
                  <li>Include transaction hash in support requests</li>
                </ul>
              </div>
            )}
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'demo' | 'live';
  onSuccess?: () => void;
}

const WithdrawModal = ({ isOpen, onClose, accountType, onSuccess }: WithdrawModalProps) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleWithdraw = async () => {
    if (!user?.id) return;
    setIsSubmitting(true);
    
    try {
      // First check if user has sufficient balance
      const { data: accounts } = await supabase
        .from('trading_accounts')
        .select('balance')
        .eq('user_id', user.id)
        .eq('account_type', accountType)
        .single();

      if (!accounts || accounts.balance < parseFloat(amount)) {
        throw new Error('Insufficient balance');
      }

      // Create withdrawal record
      const { error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          currency,
          wallet_address: walletAddress,
          status: 'completed' // Auto-complete for demo purposes
        });

      if (withdrawalError) throw withdrawalError;

      // Update account balance
      const { error: updateError } = await supabase
        .from('trading_accounts')
        .update({ 
          balance: supabase.rpc('decrement', { x: parseFloat(amount) })
        })
        .eq('user_id', user.id)
        .eq('account_type', accountType);

      if (updateError) throw updateError;

      toast({
        title: "Withdrawal Successful",
        description: `Your withdrawal of ${amount} ${currency} has been processed.`,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Withdrawal error:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process withdrawal",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw from {accountType.toUpperCase()} Account</DialogTitle>
          <DialogDescription>
            Enter your withdrawal details
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input
              id="amount"
              type="number"
              className="col-span-3"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currency" className="text-right">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="col-span-3">
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="walletAddress" className="text-right">
              {currency === 'USD' ? 'Bank Details' : 'Wallet Address'}
            </Label>
            <Input
              id="walletAddress"
              type="text"
              className="col-span-3"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder={currency === 'USD' ? 'Enter bank details' : 'Enter wallet address'}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleWithdraw}
            disabled={isSubmitting || !amount || !walletAddress}
          >
            {isSubmitting ? "Processing..." : "Withdraw"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
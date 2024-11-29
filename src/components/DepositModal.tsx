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

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'demo' | 'live';
  onSuccess?: () => void;
}

const DepositModal = ({ isOpen, onClose, accountType, onSuccess }: DepositModalProps) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDeposit = async () => {
    if (!user?.id) return;
    setIsSubmitting(true);
    
    try {
      // First create deposit record
      const { error: depositError } = await supabase
        .from('deposits')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          currency,
          wallet_address: walletAddress,
          status: 'completed' // Auto-complete for demo purposes
        });

      if (depositError) throw depositError;

      // Then update account balance
      const { data: currentAccount } = await supabase
        .from('trading_accounts')
        .select('balance')
        .eq('user_id', user.id)
        .eq('account_type', accountType)
        .single();

      if (!currentAccount) throw new Error('Account not found');

      const newBalance = currentAccount.balance + parseFloat(amount);

      const { error: updateError } = await supabase
        .from('trading_accounts')
        .update({ balance: newBalance })
        .eq('user_id', user.id)
        .eq('account_type', accountType);

      if (updateError) throw updateError;

      toast({
        title: "Deposit Successful",
        description: `Your deposit of ${amount} ${currency} has been processed.`,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Deposit error:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process deposit",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit to {accountType.toUpperCase()} Account</DialogTitle>
          <DialogDescription>
            Enter your deposit details
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

          {currency !== 'USD' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="walletAddress" className="text-right">Wallet Address</Label>
              <Input
                id="walletAddress"
                type="text"
                className="col-span-3"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required={currency !== 'USD'}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleDeposit}
            disabled={isSubmitting || !amount || (currency !== 'USD' && !walletAddress)}
          >
            {isSubmitting ? "Processing..." : "Deposit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;

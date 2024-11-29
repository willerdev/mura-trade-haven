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
}

const DepositModal = ({ isOpen, onClose, accountType }: DepositModalProps) => {
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
      const { error } = await supabase
        .from('deposits')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          currency,
          wallet_address: walletAddress,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Deposit Initiated",
        description: `Your deposit request for ${amount} ${currency} has been initiated.`,
      });

      onClose();
    } catch (error: any) {
      console.error('Deposit error:', error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to initiate deposit",
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
                placeholder="Enter wallet address"
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
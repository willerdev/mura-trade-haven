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

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
}

const OrderModal = ({ isOpen, onClose, type }: OrderModalProps) => {
  const [amount, setAmount] = useState('');
  const [leverage, setLeverage] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to place an order",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Placing order:', {
        type,
        amount,
        leverage,
        stopLoss,
        takeProfit,
        userId: user.id
      });
      
      // Here you would typically send the order to your backend
      toast({
        title: "Success",
        description: `${type.toUpperCase()} order placed successfully`,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type.toUpperCase()} Order</DialogTitle>
          <DialogDescription>
            Enter your order details
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
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
            <Label htmlFor="leverage" className="text-right">
              Leverage
            </Label>
            <Input
              id="leverage"
              type="number"
              className="col-span-3"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              placeholder="Enter leverage (e.g., 10x)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stopLoss" className="text-right">
              Stop Loss
            </Label>
            <Input
              id="stopLoss"
              type="number"
              className="col-span-3"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="Enter stop loss price"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="takeProfit" className="text-right">
              Take Profit
            </Label>
            <Input
              id="takeProfit"
              type="number"
              className="col-span-3"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="Enter take profit price"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || !amount || !leverage || !stopLoss || !takeProfit}
            className={type === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
          >
            {isSubmitting ? "Processing..." : `Place ${type.toUpperCase()} Order`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
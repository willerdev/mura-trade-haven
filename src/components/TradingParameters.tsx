import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const TradingParameters = () => {
  const [amount, setAmount] = useState<string>('');
  const [leverage, setLeverage] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchExistingParameters = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('trading_parameters')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching parameters:', error);
        return;
      }
      
      if (data) {
        setAmount(data.amount.toString());
        setLeverage(data.leverage.toString());
        setStopLoss(data.stop_loss.toString());
        setTakeProfit(data.take_profit.toString());
      }
    };

    fetchExistingParameters();
  }, [user]);

  const handleSubmit = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "You must be logged in to set trading parameters",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data: existingParams } = await supabase
        .from('trading_parameters')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const params = {
        user_id: user.id,
        amount: parseFloat(amount),
        leverage: parseFloat(leverage),
        stop_loss: parseFloat(stopLoss),
        take_profit: parseFloat(takeProfit),
      };

      let error;
      if (existingParams) {
        ({ error } = await supabase
          .from('trading_parameters')
          .update(params)
          .eq('user_id', user.id));
      } else {
        ({ error } = await supabase
          .from('trading_parameters')
          .insert([params]));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trading parameters have been saved",
      });
      
    } catch (error: any) {
      console.error('Error saving trading parameters:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save trading parameters",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">Set Parameters</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trading Parameters</DialogTitle>
          <DialogDescription>
            Set your trading parameters before placing an order.
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
          >
            {isSubmitting ? "Saving..." : "Save Parameters"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradingParameters;
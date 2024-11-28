import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

const TradingActivationModal = () => {
  const [isAutomatic, setIsAutomatic] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleActivation = async (type: 'Automatic' | 'Manual') => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to activate trading",
          variant: "destructive",
        });
        return;
      }

      // Create a sample order to demonstrate the trading mode
      const { error } = await supabase
        .from('trading_orders')
        .insert([
          {
            user_id: user.id,
            type: 'Buy',
            amount: '0.1 BTC',
            price: '$45,000',
            trading_mode: type,
          }
        ]);

      if (error) throw error;

      setIsAutomatic(type === 'Automatic');
      setIsOpen(false);
      
      toast({
        title: "Trading Mode Activated",
        description: `${type} trading has been activated and a sample order has been created.`,
      });
    } catch (error: any) {
      console.error('Error activating trading:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to activate trading mode",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Activate Trading
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Trading Mode</DialogTitle>
          <DialogDescription>
            Choose between automatic or manual trading mode
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button
            variant={isAutomatic ? "default" : "outline"}
            onClick={() => handleActivation('Automatic')}
            className="h-24"
          >
            Activate Automatic Trading
          </Button>
          <Button
            variant={!isAutomatic ? "default" : "outline"}
            onClick={() => handleActivation('Manual')}
            className="h-24"
          >
            Activate Manual Trading
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradingActivationModal;
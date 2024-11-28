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

const TradingActivationModal = () => {
  const [isAutomatic, setIsAutomatic] = useState(false);
  const { toast } = useToast();

  const handleActivation = (type: 'automatic' | 'manual') => {
    setIsAutomatic(type === 'automatic');
    toast({
      title: "Trading Mode Activated",
      description: `${type === 'automatic' ? 'Automatic' : 'Manual'} trading has been activated.`,
    });
  };

  return (
    <Dialog>
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
            onClick={() => handleActivation('automatic')}
            className="h-24"
          >
            Activate Automatic Trading
          </Button>
          <Button
            variant={!isAutomatic ? "default" : "outline"}
            onClick={() => handleActivation('manual')}
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
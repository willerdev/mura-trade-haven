import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from '@/components/ui/card';

type TradingParameter = {
  id: string;
  amount: number;
  leverage: number;
  stop_loss: number;
  take_profit: number;
  created_at: string;
}

const ViewTradingParameters = () => {
  const { user } = useAuth();
  
  const { data: parameters, isLoading } = useQuery({
    queryKey: ['tradingParameters', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_parameters')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as TradingParameter[];
    },
    enabled: !!user?.id
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">View Parameters</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Saved Trading Parameters</DialogTitle>
          <DialogDescription>
            View your previously saved trading parameters
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
          {isLoading ? (
            <div className="text-center py-4">Loading parameters...</div>
          ) : parameters?.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No saved parameters found
            </div>
          ) : (
            parameters?.map((param) => (
              <Card key={param.id} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Amount</p>
                    <p className="text-lg">${param.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Leverage</p>
                    <p className="text-lg">{param.leverage}x</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Stop Loss</p>
                    <p className="text-lg">${param.stop_loss}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Take Profit</p>
                    <p className="text-lg">${param.take_profit}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Saved on {new Date(param.created_at).toLocaleDateString()}
                </p>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTradingParameters;
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TradingParameters from '../components/TradingParameters';
import ViewTradingParameters from '../components/ViewTradingParameters';
import OrderHistory from '../components/OrderHistory';
import OrderModal from '../components/OrderModal';
import TradingActivationModal from '../components/TradingActivationModal';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ForexResponse = {
  success: boolean;
  base: string;
  timestamp: number;
  rates: {
    EUR: number;
    INR: number;
    JPY: number;
  };
};

const Dashboard = () => {
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [selectedAccount, setSelectedAccount] = useState<'demo' | 'live'>('demo');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const { user } = useAuth();

  const { data: accounts, refetch: refetchAccounts } = useQuery({
    queryKey: ['trading-accounts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_accounts')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const currentAccount = accounts?.find(acc => acc.account_type === selectedAccount);

  const handleOrderClick = (type: 'buy' | 'sell') => {
    setOrderType(type);
    setOrderModalOpen(true);
  };

  const { data: forexData, isLoading } = useQuery({
    queryKey: ['forex-rates'],
    queryFn: async () => {
      const response = await fetch(
        'https://api.forexrateapi.com/v1/latest?api_key=172e9aaa461812752d832aa64472e504&base=USD&currencies=EUR,INR,JPY'
      );
      return response.json();
    },
    // Cache for 5 minutes
    staleTime: 250 * 60 * 1000,
    // Refetch in background every 5 minutes
    refetchInterval: 250 * 60 * 1000
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Account Selection and Balance */}
        <div className="p-2 md:p-4">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Select value={selectedAccount} onValueChange={(value: 'demo' | 'live') => setSelectedAccount(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Demo Account</SelectItem>
                    <SelectItem value="live">Live Account</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-lg font-semibold">
                  Balance: ${currentAccount?.balance.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setDepositModalOpen(true)}>
                  Deposit
                </Button>
                <Button onClick={() => setWithdrawModalOpen(true)}>
                  Withdraw
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 p-2 md:p-4">
          <Card className="p-3 md:p-4">
            <h3 className="text-xs md:text-sm font-semibold text-muted-foreground mb-1 md:mb-2">USD/EUR</h3>
            <div className="text-lg md:text-2xl font-bold">
              €{forexData?.rates.EUR.toFixed(4) || '...'}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Base: USD</div>
          </Card>
          <Card className="p-3 md:p-4">
            <h3 className="text-xs md:text-sm font-semibold text-muted-foreground mb-1 md:mb-2">USD/INR</h3>
            <div className="text-lg md:text-2xl font-bold">
              ₹{forexData?.rates.INR.toFixed(2) || '...'}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Base: USD</div>
          </Card>
          <Card className="p-3 md:p-4">
            <h3 className="text-xs md:text-sm font-semibold text-muted-foreground mb-1 md:mb-2">USD/JPY</h3>
            <div className="text-lg md:text-2xl font-bold">
              ¥{forexData?.rates.JPY.toFixed(2) || '...'}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">Base: USD</div>
          </Card>
          <Card className="p-3 md:p-4">
            <h3 className="text-xs md:text-sm font-semibold text-muted-foreground mb-1 md:mb-2">Market Status</h3>
            <div className={`text-lg md:text-2xl font-bold ${isLoading ? 'text-yellow-500' : 'text-green-500'}`}>
              {isLoading ? 'Loading' : 'Active'}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">
              Last update: {forexData ? new Date(forexData.timestamp * 1000).toLocaleTimeString() : '...'}
            </div>
          </Card>
        </div>

        {/* Main Chart Area */}
        <div className="flex-grow p-2 md:p-4">
          {/* TradingViewChart */}
        </div>

        {/* Trading Controls - Mobile Optimized */}
        <div className="md:hidden p-2 space-y-2">
          <Card className="p-3">
            <h3 className="text-lg font-semibold mb-3">Quick Trade</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <TradingParameters />
                <ViewTradingParameters />
              </div>
              <TradingActivationModal />
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => handleOrderClick('buy')}
              >
                Buy
              </Button>
              <Button 
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={() => handleOrderClick('sell')}
              >
                Sell
              </Button>
            </div>
          </Card>
        </div>

        {/* Trading Sidebar - Desktop Only */}
        <div className="hidden md:block w-80 p-4 glass border-l fixed right-0 top-16 bottom-0">
          <Card className="p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Place Trade</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <TradingParameters />
                <ViewTradingParameters />
              </div>
              <TradingActivationModal />
              <Button 
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => handleOrderClick('buy')}
              >
                Buy
              </Button>
              <Button 
                className="w-full bg-red-500 hover:bg-red-600"
                onClick={() => handleOrderClick('sell')}
              >
                Sell
              </Button>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Trading Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Position Size</span>
                <span>$10,234.56</span>
              </div>
              <div className="flex justify-between">
                <span>Leverage</span>
                <span>10x</span>
              </div>
              <div className="flex justify-between">
                <span>Margin</span>
                <span>$1,023.45</span>
              </div>
              <div className="flex justify-between">
                <span>Liquidation Price</span>
                <span className="text-red-500">$41,234.56</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Order History */}
        <div className="p-2 md:p-4 md:mr-80">
          <OrderHistory />
        </div>

        {/* Modals */}
        <OrderModal
          isOpen={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
          type={orderType}
        />
        <DepositModal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          accountType={selectedAccount}
          onSuccess={refetchAccounts}
        />
        <WithdrawModal
          isOpen={withdrawModalOpen}
          onClose={() => setWithdrawModalOpen(false)}
          accountType={selectedAccount}
          onSuccess={refetchAccounts}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

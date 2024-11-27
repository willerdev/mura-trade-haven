import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: any) => any;
    };
  }
}

const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const [amount, setAmount] = useState<string>('');
  const [leverage, setLeverage] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');

  useEffect(() => {
    const initializeWidget = () => {
      if (!containerRef.current || !window.TradingView) {
        console.log('TradingView or container not available');
        return;
      }

      try {
        // Clear previous widget instance if it exists
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const widgetOptions = {
          autosize: true,
          symbol: 'BINANCE:BTCUSDT',
          interval: '1',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart'
        };

        // Create new widget instance
        widgetRef.current = new window.TradingView.widget(widgetOptions);
        console.log('TradingView widget initialized');
      } catch (error) {
        console.error('Failed to initialize TradingView widget:', error);
      }
    };

    // Load TradingView script if not already loaded
    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initializeWidget;
      script.onerror = () => console.error('Failed to load TradingView script');
      document.head.appendChild(script);
    } else {
      initializeWidget();
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      widgetRef.current = null;
    };
  }, []);

  // Mock order data - replace with real data from your backend
  const orders = [
    { id: 1, type: 'Buy', amount: '0.5 BTC', price: '$45,000', status: 'Completed', date: '2024-02-20' },
    { id: 2, type: 'Sell', amount: '1.2 ETH', price: '$3,000', status: 'Pending', date: '2024-02-19' },
    { id: 3, type: 'Buy', amount: '100 XRP', price: '$100', status: 'Completed', date: '2024-02-18' },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Main Chart Area */}
        <div className="flex-grow p-4">
          <div ref={containerRef} id="tradingview_chart" className="w-full h-full glass" />
        </div>

        {/* Trading Sidebar */}
        <div className="w-80 p-4 glass border-l fixed right-0 top-16 bottom-0">
          <Card className="p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Place Trade</h3>
            <div className="space-y-4">
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
                </DialogContent>
              </Dialog>
              <Button className="w-full bg-green-500 hover:bg-green-600">Buy</Button>
              <Button className="w-full bg-red-500 hover:bg-red-600">Sell</Button>
              <Button className="w-full" variant="outline">Auto Trade</Button>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>BTC/USDT</span>
                <span className="text-green-500">$45,123.45</span>
              </div>
              <div className="flex justify-between">
                <span>24h Change</span>
                <span className="text-red-500">-2.34%</span>
              </div>
              <div className="flex justify-between">
                <span>24h Volume</span>
                <span>$1.2B</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Order History */}
        <div className="p-4 mr-80">
          <Card className="p-4">
            <h3 className="text-xl font-semibold mb-4">Order History</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className={order.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>
                      {order.type}
                    </TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>{order.price}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
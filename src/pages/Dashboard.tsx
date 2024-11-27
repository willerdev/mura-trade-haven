import { useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

declare global {
  interface Window {
    TradingView: any;
  }
}

const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeWidget = () => {
      if (!containerRef.current || !window.TradingView) {
        console.log('TradingView or container not ready');
        return;
      }

      try {
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

        new window.TradingView.widget(widgetOptions);
        console.log('TradingView widget initialized successfully');
      } catch (error) {
        console.error('Failed to initialize TradingView widget:', error);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = initializeWidget;
    script.onerror = () => console.error('Failed to load TradingView script');
    
    const existingScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
    if (!existingScript) {
      document.head.appendChild(script);
    } else {
      initializeWidget();
    }

    return () => {
      if (!existingScript) {
        script.remove();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
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
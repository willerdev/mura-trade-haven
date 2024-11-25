import { useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    TradingView: any;
  }
}

const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (containerRef.current) {
        new window.TradingView.widget({
          width: '100%',
          height: '100%',
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
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Chart Area */}
        <div className="flex-grow p-4">
          <div ref={containerRef} id="tradingview_chart" className="w-full h-full glass" />
        </div>

        {/* Trading Sidebar */}
        <div className="w-80 p-4 glass border-l">
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
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
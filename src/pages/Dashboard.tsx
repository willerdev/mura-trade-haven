import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import TradingViewChart from '../components/TradingViewChart';
import TradingParameters from '../components/TradingParameters';
import OrderHistory from '../components/OrderHistory';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">BTC/USDT</h3>
            <div className="text-2xl font-bold text-green-500">$45,123.45</div>
            <div className="text-sm text-green-500">+2.34%</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">ETH/USDT</h3>
            <div className="text-2xl font-bold text-red-500">$2,891.12</div>
            <div className="text-sm text-red-500">-1.12%</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">24h Volume</h3>
            <div className="text-2xl font-bold">$1.2B</div>
            <div className="text-sm text-muted-foreground">Across all pairs</div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">Market Status</h3>
            <div className="text-2xl font-bold text-green-500">Active</div>
            <div className="text-sm text-muted-foreground">All systems operational</div>
          </Card>
        </div>

        {/* Main Chart Area */}
        <div className="flex-grow p-4">
          <TradingViewChart />
        </div>

        {/* Trading Sidebar */}
        <div className="w-80 p-4 glass border-l fixed right-0 top-16 bottom-0">
          <Card className="p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4">Place Trade</h3>
            <div className="space-y-4">
              <TradingParameters />
              <Button className="w-full bg-green-500 hover:bg-green-600">Buy</Button>
              <Button className="w-full bg-red-500 hover:bg-red-600">Sell</Button>
              <Button className="w-full" variant="outline">Auto Trade</Button>
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
        <div className="p-4 mr-80">
          <OrderHistory />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
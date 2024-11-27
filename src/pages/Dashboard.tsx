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
          <OrderHistory />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
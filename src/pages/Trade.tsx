import DashboardLayout from '../components/DashboardLayout';
import TradingParameters from '../components/TradingParameters';
import { Button } from '@/components/ui/button';

const Trade = () => {
  return (
    <DashboardLayout>
      <div className="p-4 pb-20 md:pb-4">
        <div className="space-y-4">
          <TradingParameters />
          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full bg-green-500 hover:bg-green-600">
              Buy/Long
            </Button>
            <Button className="w-full bg-red-500 hover:bg-red-600">
              Sell/Short
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trade;
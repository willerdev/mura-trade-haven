import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';

const Markets = () => {
  const markets = [
    { name: 'BTC/USDT', price: '45,123.45', change: '+2.34%', changeType: 'positive' },
    { name: 'ETH/USDT', price: '2,891.12', change: '-1.12%', changeType: 'negative' },
    { name: 'BNB/USDT', price: '312.45', change: '+0.89%', changeType: 'positive' },
    { name: 'SOL/USDT', price: '98.76', change: '+3.45%', changeType: 'positive' },
    { name: 'XRP/USDT', price: '0.5678', change: '-0.23%', changeType: 'negative' },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 pb-20 md:pb-4">
        <h1 className="text-2xl font-bold mb-4">Markets</h1>
        <div className="space-y-2">
          {markets.map((market) => (
            <Card key={market.name} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{market.name}</h3>
                  <p className="text-sm text-muted-foreground">Price: ${market.price}</p>
                </div>
                <p className={`font-semibold ${market.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                  {market.change}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Markets;
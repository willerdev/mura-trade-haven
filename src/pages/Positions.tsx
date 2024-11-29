import DashboardLayout from '../components/DashboardLayout';
import { Card } from '@/components/ui/card';

const Positions = () => {
  return (
    <DashboardLayout>
      <div className="p-4 pb-20 md:pb-4">
        <h1 className="text-2xl font-bold mb-4">Positions</h1>
        <Card className="p-4">
          <p className="text-center text-muted-foreground">No open positions</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Positions;
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

const OrderHistory = () => {
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['tradingOrders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trading_orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <h3 className="text-xl font-semibold mb-4">Order History</h3>
        <div className="text-center py-4">Loading orders...</div>
      </Card>
    );
  }

  return (
    <Card className="p-4 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4">Order History</h3>
      <div className="min-w-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trading Mode</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className={order.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>
                  {order.type}
                </TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.trading_mode}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default OrderHistory;
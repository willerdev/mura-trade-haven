import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OrderHistory = () => {
  const orders = [
    { id: 1, type: 'Buy', amount: '0.5 BTC', price: '$45,000', status: 'Completed', date: '2024-02-20' },
    { id: 2, type: 'Sell', amount: '1.2 ETH', price: '$3,000', status: 'Pending', date: '2024-02-19' },
    { id: 3, type: 'Buy', amount: '100 XRP', price: '$100', status: 'Completed', date: '2024-02-18' },
  ];

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
              <TableHead className="hidden md:table-cell">Date</TableHead>
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
                <TableCell className="hidden md:table-cell">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default OrderHistory;

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersService, Order } from '@/services/orders';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatters';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

function OrderStatusBadge({ status }: { status: string }) {
  let variant: "default" | "outline" | "secondary" | "destructive" = "default";
  
  switch (status.toLowerCase()) {
    case 'completed':
      variant = "default";
      break;
    case 'processing':
      variant = "secondary";
      break;
    case 'cancelled':
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }
  
  return <Badge variant={variant}>{status}</Badge>;
}

function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Order Date</p>
          <p>{formatDate(order.created_at)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <OrderStatusBadge status={order.status} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="font-mono text-xs">{order.id}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="font-semibold">{order.total_amount.toFixed(3)} KD</p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Items</h4>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      {item.customizations?.container && (
                        <p className="text-xs text-muted-foreground">
                          Container: {item.customizations.container.name}
                        </p>
                      )}
                      {item.customizations?.toppingNames && item.customizations.toppingNames.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Toppings: {item.customizations.toppingNames.join(', ')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{parseFloat(item.price).toFixed(3)} KD</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {order.special_instructions && (
        <div>
          <h4 className="text-sm font-medium mb-2">Special Instructions</h4>
          <p className="text-sm bg-muted p-3 rounded-md">{order.special_instructions}</p>
        </div>
      )}
      
      {order.delivery_address && (
        <div>
          <h4 className="text-sm font-medium mb-2">Delivery Address</h4>
          <div className="text-sm bg-muted p-3 rounded-md">
            <p>{order.delivery_address.address1}</p>
            {order.delivery_address.address2 && <p>{order.delivery_address.address2}</p>}
            <p>{order.delivery_address.city}, {order.delivery_address.province} {order.delivery_address.zip}</p>
            <p>{order.delivery_address.country}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => ordersService.getUserOrders(user),
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading your order history...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading orders. Please try again later.</div>;
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
        <Button asChild>
          <a href="/shop">Browse Products</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
              <TableCell>{formatDate(order.created_at)}</TableCell>
              <TableCell>{order.items.length} item(s)</TableCell>
              <TableCell>{order.total_amount.toFixed(3)} KD</TableCell>
              <TableCell><OrderStatusBadge status={order.status} /></TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="space-x-1"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Order Details</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && <OrderDetails order={selectedOrder} />}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

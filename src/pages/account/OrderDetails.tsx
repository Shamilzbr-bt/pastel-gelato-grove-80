
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Truck, CalendarClock, Clock, CheckCircle2, XCircle, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ordersService } from '@/services/orders';
import { toast } from 'sonner';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getOrderById(orderId || ''),
    enabled: !!orderId,
  });

  const handleCancelOrder = async () => {
    if (!orderId) return;

    try {
      const result = await ordersService.cancelOrder(orderId);
      
      if (result.success) {
        toast.success(result.message);
        refetch();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred while cancelling the order');
    } finally {
      setIsCancelDialogOpen(false);
    }
  };

  const handleRequestRefund = async () => {
    if (!orderId || !refundReason.trim()) return;

    try {
      const result = await ordersService.requestRefund(orderId, refundReason);
      
      if (result.success) {
        toast.success(result.message);
        setRefundReason('');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An error occurred while requesting a refund');
    } finally {
      setIsRefundDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case 'processing':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Preparing</Badge>;
      case 'shipped':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="page-container pt-32 pb-20">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="page-container pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Order Not Found</h1>
            <p className="mb-6">We couldn't find the order you're looking for.</p>
            <Link to="/account/orders">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const order = data.order;
  const orderItems = Array.isArray(order.items) ? order.items : [];
  const shippingAddress = order.shipping_address || {};
  const isOrderCancellable = order.status === 'pending' || order.status === 'processing';
  const isRefundable = order.status === 'delivered';

  // Function to safely format the address
  const formatAddress = (address: any) => {
    if (!address) return '';
    
    let parts = [];
    if (address.flat_no) parts.push(`Flat ${address.flat_no}`);
    if (address.building_number) parts.push(`Building ${address.building_number}`);
    if (address.block) parts.push(`Block ${address.block}`);
    if (address.street) parts.push(`Street ${address.street}`);
    if (address.avenue) parts.push(`Avenue ${address.avenue}`);
    if (address.governorate) parts.push(address.governorate);
    
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <Link to="/account/orders" className="text-muted-foreground hover:text-foreground inline-flex items-center mb-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
              <h1 className="text-3xl font-bold">Order #{order.id.substring(0, 8)}</h1>
              <p className="text-muted-foreground">
                Placed on {formatDate(order.created_at)} at {formatTime(order.created_at)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              {getStatusBadge(order.status)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items and Summary */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderItems.map((item: any, index: number) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                          🍦
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.container && (
                              <span className="inline-block mr-2">Container: {item.container}</span>
                            )}
                            {item.toppings && item.toppings.length > 0 && (
                              <span>Toppings: {item.toppings.join(', ')}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.quantity} × {item.price} KD</div>
                          <div className="text-sm font-medium">{item.total} KD</div>
                        </div>
                      </div>
                    ))}
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{order.subtotal.toFixed(3)} KD</span>
                      </div>
                      
                      {order.shipping_cost > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>{order.shipping_cost.toFixed(3)} KD</span>
                        </div>
                      )}
                      
                      {order.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Discount</span>
                          <span className="text-green-600">-{order.discount.toFixed(3)} KD</span>
                        </div>
                      )}
                      
                      {order.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span>{order.tax.toFixed(3)} KD</span>
                        </div>
                      )}
                      
                      <Separator className="my-2" />
                      
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>{order.total_amount.toFixed(3)} KD</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Status</span>
                        <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Order Actions */}
              {(isOrderCancellable || isRefundable) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      {isOrderCancellable && (
                        <Button 
                          variant="outline" 
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => setIsCancelDialogOpen(true)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Order
                        </Button>
                      )}
                      
                      {isRefundable && (
                        <Button 
                          variant="outline"
                          onClick={() => setIsRefundDialogOpen(true)}
                        >
                          <ReceiptText className="mr-2 h-4 w-4" />
                          Request Refund
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Order Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center mb-2">
                      <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                      Shipping Address
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {shippingAddress && (
                        <>
                          {shippingAddress.first_name} {shippingAddress.last_name}<br />
                          {formatAddress(shippingAddress)}<br />
                          {shippingAddress.phone && <>Phone: {shippingAddress.phone}</>}
                        </>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium flex items-center mb-2">
                      <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                      Delivery Information
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Expected Delivery</span>
                        <span>{formatDate(order.expected_delivery)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status</span>
                        <span className="font-medium text-foreground">
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {order.delivery_instructions && (
                    <div>
                      <h3 className="font-medium flex items-center mb-2">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        Delivery Instructions
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {order.delivery_instructions}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium flex items-center mb-2">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      Payment Method
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.payment_method || 'Credit Card'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you have any questions about your order, please contact our customer support.
                  </p>
                  <Button variant="outline" className="w-full">Contact Support</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Cancel Order Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              No, Keep Order
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelOrder}
            >
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Refund Request Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Refund</DialogTitle>
            <DialogDescription>
              Please explain why you would like a refund for this order.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for refund request..."
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRequestRefund}
              disabled={!refundReason.trim()}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}

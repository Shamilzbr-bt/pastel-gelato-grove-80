
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, PackageCheck, PackageOpen, Truck, CheckCircle, Clock, ChevronLeft } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: orderData, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getOrderById(id as string),
  });
  
  const order = orderData?.success ? orderData.order : null;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="page-container pt-32 pb-20 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="page-container pt-32 pb-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">We couldn't find the order you're looking for.</p>
          <Button onClick={() => navigate('/account/orders')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  const statusSteps = [
    { key: 'placed', label: 'Order Placed', icon: PackageOpen },
    { key: 'processing', label: 'Processing', icon: PackageCheck },
    { key: 'shipped', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];
  
  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/account/orders')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
              Order Details
            </span>
            <h1 className="text-3xl font-bold mb-2">
              Order #{order.id.substring(0, 8)}
            </h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </motion.div>
          
          {/* Order Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="flex justify-between mb-2">
                  {statusSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index <= currentStepIndex;
                    return (
                      <div key={step.key} className="flex flex-col items-center text-center z-10">
                        <div className={`rounded-full p-2 ${isActive ? 'bg-gelatico-pink text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <StepIcon size={20} />
                        </div>
                        <p className={`text-sm mt-2 ${isActive ? 'font-medium' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-gelatico-pink transition-all" 
                    style={{ 
                      width: `${currentStepIndex >= 0 ? 
                        (currentStepIndex / (statusSteps.length - 1)) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-center">
                <Clock className="text-gelatico-pink h-5 w-5 mr-2" />
                <span>
                  Estimated delivery: {new Date(order.expected_delivery || Date.now() + 86400000).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center py-3 border-b last:border-0">
                    <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gelatico-baby-pink/20">
                          <PackageOpen className="h-6 w-6 text-gelatico-pink" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.options && (
                        <p className="text-sm text-muted-foreground">
                          {item.options}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{item.unit_price.toFixed(3)} KD</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Shipping Info */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                  <p>{order.shipping_address.address1}</p>
                  {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
                  <p>{order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.zip}</p>
                  <p>{order.shipping_address.country}</p>
                  {order.shipping_address.phone && <p>Phone: {order.shipping_address.phone}</p>}
                  {order.delivery_instructions && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium">Delivery Instructions:</p>
                      <p className="text-sm">{order.delivery_instructions}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{order.subtotal.toFixed(3)} KD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shipping_cost.toFixed(3)} KD</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{order.discount.toFixed(3)} KD</span>
                    </div>
                  )}
                  {order.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{order.tax.toFixed(3)} KD</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{order.total_amount.toFixed(3)} KD</span>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm">
                      <span className="font-medium">Payment Method:</span> {order.payment_method}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Payment Status:</span> {order.payment_status}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2">
                <Button variant="outline" className="w-full">
                  Download Receipt
                </Button>
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Button variant="destructive" className="w-full">
                    Cancel Order
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

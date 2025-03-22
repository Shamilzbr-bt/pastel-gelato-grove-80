
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

export default function OrderHistory() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['userOrders'],
    queryFn: () => ordersService.getUserOrders(),
  });
  
  const orders = ordersData?.success ? ordersData.orders : [];
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            My Orders
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">Order History</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            View and track all your ice cream orders
          </p>
        </motion.div>
        
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>View the status and details of all your orders</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                  <Button asChild>
                    <Link to="/shop">Shop Now</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <Link 
                      key={order.id} 
                      to={`/account/orders/${order.id}`}
                      className="block"
                    >
                      <div className="flex justify-between items-center p-4 border rounded-md hover:bg-muted transition-colors">
                        <div>
                          <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()} - {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.total_amount.toFixed(3)} KD</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${
                            order.status === 'delivered' ? 'bg-green-500' :
                            order.status === 'cancelled' ? 'bg-red-500' :
                            order.status === 'processing' ? 'bg-blue-500' :
                            order.status === 'shipped' ? 'bg-orange-500' :
                            'bg-gray-500'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

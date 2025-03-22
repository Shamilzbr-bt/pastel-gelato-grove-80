
import { supabase } from "@/integrations/supabase/client";

export interface OrderStatus {
  id: string;
  name: string;
  color: string;
}

export const orderStatuses: Record<string, OrderStatus> = {
  pending: { id: 'pending', name: 'Pending', color: 'bg-yellow-500' },
  confirmed: { id: 'confirmed', name: 'Confirmed', color: 'bg-blue-500' },
  preparing: { id: 'preparing', name: 'Preparing', color: 'bg-indigo-500' },
  out_for_delivery: { id: 'out_for_delivery', name: 'Out for Delivery', color: 'bg-orange-500' },
  delivered: { id: 'delivered', name: 'Delivered', color: 'bg-green-500' },
  cancelled: { id: 'cancelled', name: 'Cancelled', color: 'bg-red-500' },
  refunded: { id: 'refunded', name: 'Refunded', color: 'bg-purple-500' },
};

export const ordersService = {
  /**
   * Get user orders
   */
  async getUserOrders() {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to get orders');
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        orders: data
      };
    } catch (error) {
      console.error('Error getting orders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting orders'
      };
    }
  },
  
  /**
   * Get order details
   */
  async getOrderDetails(orderId: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to get order details');
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        order: data
      };
    } catch (error) {
      console.error('Error getting order details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting order details'
      };
    }
  },
  
  /**
   * Cancel order
   */
  async cancelOrder(orderId: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to cancel an order');
      }
      
      // Check if the order can be cancelled (only pending and confirmed orders can be cancelled)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();
        
      if (orderError) {
        throw orderError;
      }
      
      if (!['pending', 'confirmed'].includes(orderData.status)) {
        throw new Error('This order cannot be cancelled');
      }
      
      // Update the order status to cancelled
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        order: data
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error cancelling order'
      };
    }
  },
  
  /**
   * Request refund
   */
  async requestRefund(orderId: string, reason: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to request a refund');
      }
      
      // Check if the order is eligible for refund
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();
        
      if (orderError) {
        throw orderError;
      }
      
      // Cannot request refund for cancelled or already refunded orders
      if (['cancelled', 'refunded'].includes(orderData.status)) {
        throw new Error('This order is not eligible for refund');
      }
      
      // Create a refund request
      const { data, error } = await supabase
        .from('refund_requests')
        .insert({
          order_id: orderId,
          user_id: user.id,
          reason,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        refundRequest: data
      };
    } catch (error) {
      console.error('Error requesting refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error requesting refund'
      };
    }
  },
  
  /**
   * Get all orders (admin only)
   */
  async getAllOrders() {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in');
      }
      
      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
        
      if (roleError || !roleData) {
        throw new Error('Unauthorized access');
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        orders: data
      };
    } catch (error) {
      console.error('Error getting all orders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting all orders'
      };
    }
  },
  
  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in');
      }
      
      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();
        
      if (roleError || !roleData) {
        throw new Error('Unauthorized access');
      }
      
      // Update the order status
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        order: data
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error updating order status'
      };
    }
  }
};


import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ordersService = {
  /**
   * Get all orders for the current user
   */
  async getUserOrders() {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to view orders');
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
        orders: data || []
      };
    } catch (error) {
      console.error('Error getting user orders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting orders',
        orders: []
      };
    }
  },
  
  /**
   * Get a specific order by ID
   */
  async getOrderById(orderId: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to view order details');
      }
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (error) {
        throw error;
      }
      
      // Format the order data for display
      const orderData = {
        ...data,
        subtotal: data.total_amount - (data.shipping_cost || 0) + (data.discount || 0) - (data.tax || 0),
        shipping_cost: data.shipping_cost || 0,
        discount: data.discount || 0,
        tax: data.tax || 0,
        payment_status: data.payment_status || (data.status === 'cancelled' ? 'cancelled' : 'paid'),
        shipping_address: data.delivery_address,
        expected_delivery: data.expected_delivery || 
          new Date(new Date(data.created_at).getTime() + 86400000 * 2).toISOString(),
        delivery_instructions: data.special_instructions,
      };
      
      return {
        success: true,
        order: orderData
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
   * Cancel an order
   */
  async cancelOrder(orderId) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to cancel an order');
      }
      
      // First check if the order belongs to the user
      const { data: orderData, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (!orderData) {
        throw new Error('Order not found or you do not have permission to cancel it');
      }
      
      // Check if the order can be cancelled (not already delivered or cancelled)
      if (orderData.status === 'delivered' || orderData.status === 'cancelled') {
        throw new Error(`Cannot cancel an order that is already ${orderData.status}`);
      }
      
      // Update the order status
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        message: 'Order cancelled successfully'
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
   * Request a refund
   */
  async requestRefund(orderId, reason) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to request a refund');
      }
      
      // First check if the order belongs to the user
      const { data: orderData, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();
        
      if (fetchError) {
        throw fetchError;
      }
      
      if (!orderData) {
        throw new Error('Order not found or you do not have permission to request a refund');
      }
      
      // Create a refund request
      const { error } = await supabase
        .from('refund_requests')
        .insert({
          order_id: orderId,
          user_id: user.id,
          reason: reason,
          status: 'pending'
        });
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        message: 'Refund request submitted successfully'
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
   * Admin: Get all orders
   */
  async getAllOrders() {
    try {
      // This would typically verify admin permissions first
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles(first_name, last_name, email)')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        orders: data || []
      };
    } catch (error) {
      console.error('Error getting all orders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting orders',
        orders: []
      };
    }
  },
  
  /**
   * Admin: Update order status
   */
  async updateOrderStatus(orderId, status) {
    try {
      // This would typically verify admin permissions first
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        message: `Order status updated to ${status}`
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

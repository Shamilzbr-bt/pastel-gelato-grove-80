
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface Order {
  id: string;
  created_at: string;
  items: any[];
  total_amount: number;
  status: string;
  delivery_address?: any;
  special_instructions?: string;
}

export const ordersService = {
  async getUserOrders(user: User | null): Promise<Order[]> {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      return [];
    }
  },
  
  async getOrderById(id: string, userId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching order:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return null;
    }
  }
};

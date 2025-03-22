
import { toast } from "sonner";
import { CartItem } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutAddress {
  first_name?: string;
  last_name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
}

export interface CheckoutOptions {
  email?: string;
  address?: CheckoutAddress;
  specialInstructions?: string;
}

export const checkoutService = {
  /**
   * Process checkout locally
   */
  async processCheckout(items: CartItem[], options: CheckoutOptions = {}) {
    try {
      if (!items.length) {
        throw new Error('Cannot create checkout with empty cart');
      }

      // Log what we're processing
      console.log('Processing checkout with items:', items);
      console.log('Checkout options:', options);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => {
        const price = item.price ? parseFloat(item.price) : 0;
        return sum + (price * item.quantity);
      }, 0);

      console.log(`Total order amount: ${totalAmount}`);
      
      // Generate a formatted order summary
      const orderSummary = items.map(item => {
        return {
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          container: item.customizations?.container?.name,
          toppings: item.customizations?.toppingNames,
          total: (parseFloat(item.price || "0") * item.quantity).toFixed(3)
        };
      });
      
      console.log('Order summary:', orderSummary);
      
      // Generate a unique order ID
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Save the order to the database if the user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      
      if (user) {
        const orderData = {
          user_id: user.id,
          items: items,
          total_amount: totalAmount,
          status: 'processing',
          delivery_address: options.address || null,
          special_instructions: options.specialInstructions || null,
        };
        
        const { error } = await supabase.from('orders').insert(orderData);
        
        if (error) {
          console.error('Error saving order to database:', error);
          // Continue with processing anyway, but log the error
        } else {
          console.log('Order saved to database successfully');
        }
      } else {
        console.log('User not logged in, order not saved to database');
      }
      
      return {
        success: true,
        orderId,
        totalAmount,
        orderSummary,
        message: 'Order processed successfully'
      };
    } catch (error) {
      console.error('Error processing checkout:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};


import { toast } from "sonner";
import { CartItem } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";

export interface CheckoutAddress {
  first_name?: string;
  last_name?: string;
  governorate?: string;
  flat_no?: string;
  building_number?: string;
  block?: string;
  street?: string;
  avenue?: string;
  paci?: string;
  phone?: string;
  is_default?: boolean;
}

export interface DeliveryTime {
  date: string;
  time_slot: string;
}

export interface CheckoutOptions {
  email?: string;
  address?: CheckoutAddress;
  delivery_time?: DeliveryTime;
  special_instructions?: string;
}

export interface PaymentDetails {
  payment_method: string;
  card_number?: string;
  expiry_date?: string;
  cvv?: string;
  cardholder_name?: string;
}

export const checkoutService = {
  /**
   * Process checkout locally
   */
  async processCheckout(
    items: CartItem[], 
    options: CheckoutOptions = {}, 
    paymentDetails: PaymentDetails
  ) {
    try {
      if (!items.length) {
        throw new Error('Cannot create checkout with empty cart');
      }

      // Log what we're processing
      console.log('Processing checkout with items:', items);
      console.log('Checkout options:', options);
      console.log('Payment details:', paymentDetails);

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
      
      // In a real application, you would:
      // 1. Process payment through a payment gateway
      // 2. Save the order to the database
      
      // Save order to Supabase
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to place an order');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create an order in the database
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total_amount: totalAmount,
          items: orderSummary as any,
          delivery_address: options.address as any,
          delivery_time: options.delivery_time as any,
          special_instructions: options.special_instructions,
          payment_method: paymentDetails.payment_method
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // If the address is marked as default, save it to the user's addresses
      if (options.address && options.address.is_default) {
        const { error: addressError } = await supabase
          .from('user_addresses')
          .upsert({
            user_id: user.id,
            address: options.address as any,
            is_default: true
          });
          
        if (addressError) {
          console.error('Error saving address:', addressError);
        }
      }
      
      // Generate a unique order ID
      const orderId = order.id;
      
      // Send confirmation email (would be handled by a server function in production)
      // In this implementation, we'll simulate it with a toast
      toast.success('Order confirmation email sent!');
      
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
  },
  
  /**
   * Validate if the address is within delivery radius
   */
  async validateDeliveryAddress(address: CheckoutAddress) {
    try {
      // In a real app, this would use geocoding to check if the address
      // is within the delivery radius defined in the database
      
      // For this implementation, we'll check if the governorate is in our delivery zones
      const { data: zones, error } = await supabase
        .from('delivery_zones')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      // Check if the address governorate matches any delivery zone
      const isInDeliveryZone = zones.some(zone => 
        zone.city.toLowerCase() === address.governorate?.toLowerCase() ||
        zone.province.toLowerCase() === address.governorate?.toLowerCase()
      );
      
      return {
        valid: isInDeliveryZone,
        message: isInDeliveryZone 
          ? 'Address is within our delivery zone' 
          : 'We do not currently deliver to your location'
      };
    } catch (error) {
      console.error('Error validating address:', error);
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Error validating address'
      };
    }
  },
  
  /**
   * Get available delivery time slots
   */
  async getDeliveryTimeSlots() {
    // In a real app, this would be dynamic based on capacity, orders, etc.
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    
    const timeSlots = [
      '10:00 AM - 12:00 PM',
      '12:00 PM - 2:00 PM',
      '2:00 PM - 4:00 PM',
      '4:00 PM - 6:00 PM',
      '6:00 PM - 8:00 PM'
    ];
    
    return { dates, timeSlots };
  },
  
  /**
   * Get user addresses
   */
  async getUserAddresses() {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to get addresses');
      }
      
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        addresses: data
      };
    } catch (error) {
      console.error('Error getting addresses:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting addresses'
      };
    }
  },

  /**
   * Add a new address
   */
  async addAddress(addressData: CheckoutAddress) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to add an address');
      }
      
      // If this address is set as default, update all other addresses to non-default
      if (addressData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
      }
      
      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: user.id,
          address: addressData as any,
          is_default: addressData.is_default || false
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        addressId: data.id
      };
    } catch (error) {
      console.error('Error adding address:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error adding address'
      };
    }
  },
  
  /**
   * Update an existing address
   */
  async updateAddress(addressId: string, addressData: CheckoutAddress) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to update an address');
      }
      
      // If this address is set as default, update all other addresses to non-default
      if (addressData.is_default) {
        await supabase
          .from('user_addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .neq('id', addressId);
      }
      
      const { error } = await supabase
        .from('user_addresses')
        .update({
          address: addressData as any,
          is_default: addressData.is_default || false,
          updated_at: new Date().toISOString()
        })
        .eq('id', addressId)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error updating address:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error updating address'
      };
    }
  },
  
  /**
   * Delete an address
   */
  async deleteAddress(addressId: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to delete an address');
      }
      
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting address:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error deleting address'
      };
    }
  },
  
  /**
   * Set an address as default
   */
  async setDefaultAddress(addressId: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User must be logged in to set a default address');
      }
      
      // First, set all addresses to non-default
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);
      
      // Then set the specified address as default
      const { error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error setting default address:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error setting default address'
      };
    }
  }
};


import { supabase } from "@/integrations/supabase/client";

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: { src: string }[];
  variants: {
    id: string;
    price: string;
    title: string;
  }[];
  tags: string;
}

export interface CartItem {
  variantId: string;
  quantity: number;
  title?: string;
  price?: string;
  image?: string;
  variantTitle?: string;
}

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
}

export const shopifyService = {
  /**
   * Get all products from Shopify
   */
  async getProducts(): Promise<ShopifyProduct[]> {
    try {
      const { data, error } = await supabase.functions.invoke('shopify', {
        body: { action: 'getProducts' }
      });

      if (error) throw error;
      return data.products || [];
    } catch (error) {
      console.error('Error fetching Shopify products:', error);
      return [];
    }
  },

  /**
   * Get a specific product by ID
   */
  async getProduct(productId: string): Promise<ShopifyProduct | null> {
    try {
      const { data, error } = await supabase.functions.invoke('shopify', {
        body: { action: 'getProduct', data: { productId } }
      });

      if (error) throw error;
      return data.product || null;
    } catch (error) {
      console.error(`Error fetching Shopify product ${productId}:`, error);
      return null;
    }
  },

  /**
   * Create a checkout with the provided items and optional customer information
   */
  async createCheckout(items: CartItem[], options: CheckoutOptions = {}) {
    try {
      if (!items.length) {
        throw new Error('Cannot create checkout with empty cart');
      }

      const { data, error } = await supabase.functions.invoke('shopify', {
        body: { 
          action: 'createCheckout', 
          data: { 
            items,
            email: options.email,
            address: options.address
          } 
        }
      });

      if (error) throw error;
      
      // Return checkout URL if available
      if (data.checkout_url) {
        return {
          success: true,
          checkoutUrl: data.checkout_url,
          checkout: data.checkout
        };
      }
      
      return {
        success: true,
        checkout: data.checkout
      };
    } catch (error) {
      console.error('Error creating Shopify checkout:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};

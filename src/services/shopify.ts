
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
   * Create a checkout with the provided items
   */
  async createCheckout(items: CartItem[]) {
    try {
      const { data, error } = await supabase.functions.invoke('shopify', {
        body: { action: 'createCheckout', data: { items } }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating Shopify checkout:', error);
      throw error;
    }
  }
};


import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  created_at: string;
}

export const profileService = {
  /**
   * Get user profile
   */
  async getUserProfile() {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User not logged in');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        profile: data
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting user profile'
      };
    }
  },
  
  /**
   * Update user profile
   */
  async updateUserProfile(profile: Partial<UserProfile>) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User not logged in');
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        profile: data
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error updating user profile'
      };
    }
  },
  
  /**
   * Get user favorites
   */
  async getUserFavorites() {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User not logged in');
      }
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          product:product_id (*)
        `)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        favorites: data
      };
    } catch (error) {
      console.error('Error getting user favorites:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error getting user favorites'
      };
    }
  },
  
  /**
   * Add product to favorites
   */
  async addToFavorites(productId: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User not logged in');
      }
      
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        favorite: data
      };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error adding to favorites'
      };
    }
  },
  
  /**
   * Remove product from favorites
   */
  async removeFromFavorites(productId: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error('User not logged in');
      }
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
        
      if (error) {
        throw error;
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error removing from favorites'
      };
    }
  },
  
  /**
   * Check if product is in favorites
   */
  async isProductFavorite(productId: string) {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        return { success: true, isFavorite: false };
      }
      
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return {
        success: true,
        isFavorite: !!data
      };
    } catch (error) {
      console.error('Error checking favorites:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error checking favorites'
      };
    }
  }
};

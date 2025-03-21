
import { useState, useEffect } from 'react';
import { CartItem } from '@/services/shopify';
import { toast } from "sonner";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('gelatico-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('gelatico-cart', JSON.stringify(cartItems));
      // Dispatch event to notify other components of cart update
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);
  
  const updateQuantity = (variantId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(variantId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.variantId === variantId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };
  
  const removeItem = (variantId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
    toast.success("Item removed from cart");
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };
  
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price ? parseFloat(item.price) : 0;
      return total + (price * item.quantity);
    }, 0);
  };
  
  return {
    cartItems,
    setCartItems,
    isLoading,
    setIsLoading,
    updateQuantity,
    removeItem,
    clearCart,
    calculateSubtotal
  };
}

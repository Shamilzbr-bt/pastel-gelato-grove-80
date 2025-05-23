
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ContainerOption } from "@/components/product/ContainerSelector";

export interface CartItem {
  variantId: string;
  quantity: number;
  title?: string;
  price?: string;
  image?: string;
  variantTitle?: string;
  customizations?: {
    container?: ContainerOption;
    toppings?: Array<{
      id: string;
      name: string;
      price: number;
      category: string;
    }>;
    toppingNames?: string;
  };
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gelatico-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
        localStorage.removeItem('gelatico-cart');
      }
    }
    
    // Listen for cart updates from other tabs/components
    const handleCartUpdate = () => {
      const updatedCart = localStorage.getItem('gelatico-cart');
      if (updatedCart) {
        try {
          setCartItems(JSON.parse(updatedCart));
        } catch (e) {
          console.error('Error parsing updated cart:', e);
        }
      }
    };
    
    window.addEventListener('cart-updated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);
  
  // Save cart on change
  useEffect(() => {
    localStorage.setItem('gelatico-cart', JSON.stringify(cartItems));
    // Dispatch event for other components to pick up
    window.dispatchEvent(new Event('cart-updated'));
  }, [cartItems]);
  
  const addItem = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.variantId === item.variantId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, item];
      }
    });
    
    toast.success(`${item.title || 'Product'} added to cart`);
  };
  
  const updateQuantity = (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
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
    localStorage.removeItem('gelatico-cart');
    toast.success("Cart cleared");
  };
  
  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => {
      const price = item.price ? parseFloat(item.price) : 0;
      return total + (price * item.quantity);
    }, 0);
  };
  
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  return {
    cartItems,
    setCartItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    calculateSubtotal,
    itemCount,
  };
}

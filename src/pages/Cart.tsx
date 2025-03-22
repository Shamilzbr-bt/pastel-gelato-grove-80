import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import { shopifyService } from '@/services/shopify';
import { useCart } from '@/hooks/useCart';
import CartItemList from '@/components/cart/CartItemList';
import OrderSummary from '@/components/cart/OrderSummary';
import EmptyCart from '@/components/cart/EmptyCart';

export default function Cart() {
  const { 
    cartItems, 
    setCartItems,
    updateQuantity, 
    removeItem, 
    clearCart, 
    calculateSubtotal 
  } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();
  
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      const response = await shopifyService.createCheckout(cartItems);
      
      if (response.success && response.checkoutUrl) {
        toast.success("Redirecting to secure checkout...");
        
        // Redirect to Shopify checkout
        window.location.href = response.checkoutUrl;
      } else if (!response.success) {
        toast.error(response.error || "There was a problem processing your order");
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error("There was a problem processing your order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  const subtotal = calculateSubtotal();
  const shippingFee = subtotal >= 15 ? 0 : 2;
  const total = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            Your Cart
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-gelatico mb-6">
            Shopping Cart
          </h1>
        </motion.div>
        
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            {/* Cart Items */}
            <CartItemList 
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              clearCart={clearCart}
            />
            
            {/* Order Summary */}
            <OrderSummary 
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              handleCheckout={handleCheckout}
              isCheckingOut={isCheckingOut}
              cartItemsEmpty={cartItems.length === 0}
            />
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

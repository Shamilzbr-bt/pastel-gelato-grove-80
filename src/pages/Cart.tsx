
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { toast } from "sonner";
import { CartItem, shopifyService } from '@/services/shopify';

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
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
  
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    setIsCheckingOut(true);
    
    try {
      const checkout = await shopifyService.createCheckout(cartItems);
      
      // In a real implementation, you would redirect to the Shopify checkout URL
      // For this demo, we'll just clear the cart and show a success message
      toast.success("Order placed successfully!");
      setCartItems([]);
      
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error("There was a problem processing your order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  const subtotal = calculateSubtotal();
  const shippingFee = subtotal >= 50 ? 0 : 5.99;
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mb-6">
              <ShoppingBag size={60} className="mx-auto text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-gelatico mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/shop" className="gelatico-button">
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Items ({cartItems.length})</h2>
                <button 
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-gelatico-pink transition-colors duration-300 flex items-center"
                >
                  <Trash2 size={16} className="mr-1" />
                  Clear Cart
                </button>
              </div>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.variantId} 
                    className="p-4 border border-muted rounded-xl flex flex-col sm:flex-row gap-4"
                  >
                    {item.image && (
                      <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title || 'Product'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title || 'Product'}</h3>
                      <p className="text-muted-foreground text-sm">
                        Variant: {item.variantId}
                      </p>
                      <div className="mt-3 flex justify-between items-center">
                        <div className="flex items-center border border-muted rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="px-2 py-1 text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
                          >
                            <Minus size={14} />
                          </button>
                          
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="px-2 py-1 text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            ${item.price ? (parseFloat(item.price) * item.quantity).toFixed(2) : '0.00'}
                          </span>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-muted-foreground hover:text-red-500 transition-colors duration-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-muted/10 p-6 rounded-2xl border border-muted h-fit">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shippingFee === 0 
                      ? <span className="text-green-600">Free</span> 
                      : `$${shippingFee.toFixed(2)}`
                    }
                  </span>
                </div>
                
                {shippingFee > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Free shipping on orders over $50
                  </div>
                )}
                
                <div className="border-t border-muted pt-4 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.length === 0}
                className="gelatico-button w-full flex items-center justify-center"
              >
                {isCheckingOut ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Checkout
                    <ArrowRight size={16} className="ml-2" />
                  </span>
                )}
              </button>
              
              <div className="mt-4">
                <Link 
                  to="/shop" 
                  className="text-sm text-center block text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

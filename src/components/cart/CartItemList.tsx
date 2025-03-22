
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/hooks/useCart';
import CartItem from './CartItem';
import { motion } from 'framer-motion';

interface CartItemListProps {
  cartItems: CartItemType[];
  updateQuantity: (variantId: string, newQuantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
}

export default function CartItemList({ 
  cartItems, 
  updateQuantity, 
  removeItem, 
  clearCart 
}: CartItemListProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Items ({cartItems.length})</h2>
        <button 
          onClick={clearCart}
          className="text-sm text-muted-foreground hover:text-gelatico-pink transition-colors duration-300 flex items-center"
          disabled={cartItems.length === 0}
        >
          <Trash2 size={16} className="mr-1" />
          Clear Cart
        </button>
      </div>
      
      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <motion.div
            key={item.variantId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CartItem 
              item={item} 
              updateQuantity={updateQuantity} 
              removeItem={removeItem} 
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

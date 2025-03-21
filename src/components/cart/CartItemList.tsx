
import { Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/services/shopify';
import CartItem from './CartItem';

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
        >
          <Trash2 size={16} className="mr-1" />
          Clear Cart
        </button>
      </div>
      
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem 
            key={item.variantId} 
            item={item} 
            updateQuantity={updateQuantity} 
            removeItem={removeItem} 
          />
        ))}
      </div>
    </div>
  );
}

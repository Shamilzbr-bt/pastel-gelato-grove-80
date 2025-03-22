
import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatters';

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (variantId: string, newQuantity: number) => void;
  removeItem: (variantId: string) => void;
}

export default function CartItem({ item, updateQuantity, removeItem }: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(item.variantId);
    }, 300);
  };

  const itemPrice = item.price ? parseFloat(item.price) : 0;
  const totalPrice = itemPrice * item.quantity;
  
  // Function to clean image path
  const cleanImagePath = (path: string = '') => {
    // Remove /public prefix if it exists
    if (path.startsWith('/public/')) {
      return path.substring(7);
    }
    return path;
  };
  
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm transition-all duration-300 ${isRemoving ? 'opacity-0 transform -translate-y-4' : ''}`}>
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={cleanImagePath(item.image)} 
            alt={item.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/400x400/e81cff/ffffff?text=Missing+Image';
            }}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-lg">{item.title}</h3>
              {item.variantTitle && (
                <p className="text-sm text-muted-foreground">{item.variantTitle}</p>
              )}
              {item.customizations?.toppingNames && (
                <p className="text-xs text-muted-foreground">
                  Toppings: {item.customizations.toppingNames}
                </p>
              )}
            </div>
            <button
              onClick={handleRemove}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center border rounded-full">
              <button
                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-gelatico-pink transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-gelatico-pink transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <div className="text-right">
              <span className="font-medium text-gelatico-pink">
                {formatPrice(totalPrice)}
              </span>
              <div className="text-xs text-muted-foreground">
                {formatPrice(itemPrice)} each
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

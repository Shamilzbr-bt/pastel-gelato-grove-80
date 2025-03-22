
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/hooks/useCart';
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (variantId: string, newQuantity: number) => void;
  removeItem: (variantId: string) => void;
}

export default function CartItem({ item, updateQuantity, removeItem }: CartItemProps) {
  return (
    <div className="p-4 border border-muted rounded-xl flex flex-col sm:flex-row gap-4">
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
        {item.variantTitle && item.variantTitle !== "Default" && (
          <p className="text-muted-foreground text-sm">
            {item.variantTitle}
          </p>
        )}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center border border-muted rounded-full overflow-hidden">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="px-2 py-1 text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="px-2 py-1 text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-semibold">
              {item.price ? (parseFloat(item.price) * item.quantity).toFixed(3) : '0.000'} KD
            </span>
            <button
              onClick={() => removeItem(item.variantId)}
              className="text-muted-foreground hover:text-red-500 transition-colors duration-300"
              aria-label="Remove item"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function EmptyCart() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="mb-6 flex justify-center">
        <img 
          src="/public/lovable-uploads/6a86ae94-f6ae-4ab1-abd3-4587a6f0c711.png" 
          alt="Gelatico Logo" 
          className="w-32 h-32 object-contain"
        />
      </div>
      <h2 className="text-2xl font-gelatico mb-4">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8">
        Looks like you haven't added any delicious gelato to your cart yet.
      </p>
      <Link to="/shop" className="gelatico-button">
        Continue Shopping
      </Link>
    </motion.div>
  );
}

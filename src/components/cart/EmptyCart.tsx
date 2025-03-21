
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
  );
}

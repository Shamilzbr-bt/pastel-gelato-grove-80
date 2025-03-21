
import { motion } from 'framer-motion';

export default function ShopPageHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
        Gelatico Shop
      </span>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-gelatico mb-6">
        Shop Our Products
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Explore our collection of premium gelato flavors, gift cards, and Gelatico branded merchandise. 
        Perfect for treating yourself or finding a special gift for the gelato lover in your life.
      </p>
    </motion.div>
  );
}

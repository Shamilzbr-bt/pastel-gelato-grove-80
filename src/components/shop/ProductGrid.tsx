
import { motion } from 'framer-motion';
import { Product } from '@/pages/Shop';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
  onResetCategory: () => void;
}

export default function ProductGrid({ 
  products, 
  isLoading, 
  onAddToCart,
  onResetCategory 
}: ProductGridProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {isLoading ? (
        // Loading skeleton
        Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-5">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))
      ) : products.length > 0 ? (
        products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <h3 className="text-2xl font-gelatico mb-4">No products found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your category filter.</p>
          <button 
            onClick={onResetCategory}
            className="px-4 py-2 rounded-full bg-gelatico-pink text-white hover:bg-gelatico-pink/90 transition-all duration-300"
          >
            View All Products
          </button>
        </div>
      )}
    </motion.div>
  );
}

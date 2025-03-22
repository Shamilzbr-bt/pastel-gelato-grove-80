
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import ShopPageHeader from '@/components/shop/ShopPageHeader';
import CategoryFilter from '@/components/shop/CategoryFilter';
import ProductGrid from '@/components/shop/ProductGrid';
import GiftCardHighlight from '@/components/shop/GiftCardHighlight';
import { getLocalProducts, getDemoProducts } from '@/data/products';
import { useCart, CartItem } from '@/hooks/useCart';

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: { src: string }[];
  variants: {
    id: string;
    price: string;
    title: string;
  }[];
  tags: string;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { addItem } = useCart();
  
  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        // Get local products only
        const localProducts = getLocalProducts();
        setProducts(localProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Using demo data instead.");
        
        // Fall back to demo products
        setProducts(getDemoProducts());
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProducts();
  }, []);
  
  // Extract categories from product tags
  const categories = Array.from(
    new Set(
      products
        .flatMap(p => p.tags ? p.tags.split(',').map(tag => tag.trim()) : [])
        .filter(tag => tag)
    )
  );
  
  const filteredProducts = activeCategory 
    ? products.filter(product => 
        product.tags && product.tags.split(',').map(t => t.trim()).includes(activeCategory)
      ) 
    : products;
  
  const addToCart = (product: Product) => {
    // Use the first variant by default
    const variant = product.variants[0];
    if (!variant) {
      toast.error("This product is not available for purchase");
      return;
    }
    
    const newItem: CartItem = { 
      variantId: variant.id, 
      quantity: 1,
      title: product.title,
      price: variant.price,
      image: product.images[0]?.src,
      variantTitle: variant.title
    };
    
    addItem(newItem);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
        <ShopPageHeader />
        
        {/* Category Filter */}
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        
        {/* Products Grid */}
        <ProductGrid 
          products={filteredProducts} 
          isLoading={isLoading} 
          onAddToCart={addToCart}
          onResetCategory={() => setActiveCategory(null)}
        />
        
        {/* Gift Cards Highlight */}
        <GiftCardHighlight 
          onViewGiftCards={() => setActiveCategory("Gift Cards")} 
        />
      </div>
      
      <Footer />
    </div>
  );
}

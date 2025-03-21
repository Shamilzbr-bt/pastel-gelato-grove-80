
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import { shopifyService, ShopifyProduct, CartItem } from '@/services/shopify';
import ShopPageHeader from '@/components/shop/ShopPageHeader';
import CategoryFilter from '@/components/shop/CategoryFilter';
import ProductGrid from '@/components/shop/ProductGrid';
import GiftCardHighlight from '@/components/shop/GiftCardHighlight';
import { getLocalProducts, getDemoProducts } from '@/data/products';

export default function Shop() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Fetch products from Shopify
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const shopifyProducts = await shopifyService.getProducts();
        
        // Combine Shopify products with our local products
        const localProducts = getLocalProducts();
        
        const allProducts = [...shopifyProducts, ...localProducts];
        setProducts(allProducts);
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
  
  const addToCart = (product: ShopifyProduct) => {
    // Use the first variant by default
    const variant = product.variants[0];
    if (!variant) {
      toast.error("This product is not available for purchase");
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.variantId === variant.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.variantId === variant.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem = { 
          variantId: variant.id, 
          quantity: 1,
          title: product.title,
          price: variant.price,
          image: product.images[0]?.src,
          variantTitle: variant.title
        };
        
        // Store updated cart in localStorage
        const updatedCart = [...prevCart, newItem];
        localStorage.setItem('gelatico-cart', JSON.stringify(updatedCart));
        
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('cart-updated'));
        
        return updatedCart;
      }
    });
    
    toast.success(`${product.title} added to your cart!`);
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

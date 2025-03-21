
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag } from 'lucide-react';
import { toast } from "sonner";
import { shopifyService, ShopifyProduct, CartItem } from '@/services/shopify';

// Define gelato flavors using the uploaded images
const flavorImages = [
  {
    id: "cookies-cream",
    title: "Cookies & Cream",
    image: "/public/lovable-uploads/87089c2c-b9dc-4fd2-8479-a5af0a12ba4e.png",
    price: "6.99"
  },
  {
    id: "caramel-praline",
    title: "Caramel Praline",
    image: "/public/lovable-uploads/c3b5ce80-2d12-47c5-ad01-5dd6b68ece66.png", 
    price: "6.99"
  },
  {
    id: "chocolate-fudge",
    title: "Chocolate Fudge",
    image: "/public/lovable-uploads/595cde14-035d-422a-a7f0-6c77c7a1370c.png",
    price: "6.99"
  },
  {
    id: "lime-sorbet",
    title: "Lime Sorbet",
    image: "/public/lovable-uploads/90da045e-8c11-4f07-9d5c-647f8ae7bd49.png",
    price: "5.99"
  },
  {
    id: "mango-sorbet",
    title: "Mango Sorbet",
    image: "/public/lovable-uploads/fdbb580d-b73f-4350-8f55-c1a36f70152e.png",
    price: "5.99"
  },
  {
    id: "strawberry-cheesecake",
    title: "Strawberry Cheesecake",
    image: "/public/lovable-uploads/6172e215-ce04-45ed-81e8-0d5da45904d9.png",
    price: "6.99"
  },
  {
    id: "milkshakes",
    title: "Gelato Milkshakes",
    image: "/public/lovable-uploads/07867876-13e2-4ed0-83ed-13a0369c8822.png",
    price: "7.99"
  }
];

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
        
        // Combine Shopify products with our local flavor images
        const localProducts = flavorImages.map(flavor => ({
          id: flavor.id,
          title: flavor.title,
          description: `Premium Italian gelato made with the finest ingredients.`,
          handle: flavor.id,
          images: [{ src: flavor.image }],
          variants: [{ id: `${flavor.id}-regular`, price: flavor.price, title: "Regular Size" }],
          tags: "Gelato,Premium"
        }));
        
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

  // Dummy function to get demo products if Shopify fetch fails
  const getDemoProducts = () => [
    {
      id: "gift-card-25",
      title: "Gelatico Gift Card - $25",
      description: "Share the joy of gelato with friends and family. A perfect gift for any occasion.",
      handle: "gift-card-25",
      images: [{ src: "/public/lovable-uploads/4b999340-0478-451a-bd04-7ed0eba14eb5.png" }],
      variants: [{ id: "gift-card-25-variant", price: "25.00", title: "Default" }],
      tags: "Gift Cards"
    },
    {
      id: "gift-card-50",
      title: "Gelatico Gift Card - $50",
      description: "Share the joy of gelato with friends and family. A perfect gift for any occasion.",
      handle: "gift-card-50",
      images: [{ src: "/public/lovable-uploads/4b999340-0478-451a-bd04-7ed0eba14eb5.png" }],
      variants: [{ id: "gift-card-50-variant", price: "50.00", title: "Default" }],
      tags: "Gift Cards"
    },
    ...flavorImages.map(flavor => ({
      id: flavor.id,
      title: flavor.title,
      description: `Premium Italian gelato made with the finest ingredients.`,
      handle: flavor.id,
      images: [{ src: flavor.image }],
      variants: [{ id: `${flavor.id}-regular`, price: flavor.price, title: "Regular Size" }],
      tags: "Gelato,Premium"
    }))
  ] as ShopifyProduct[];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
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
        
        {/* Category Filter */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          <button
            className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
              activeCategory === null
                ? "border-gelatico-pink bg-gelatico-baby-pink/20 text-gelatico-pink"
                : "border-muted-foreground/30 hover:border-gelatico-pink"
            }`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                activeCategory === category
                  ? "border-gelatico-pink bg-gelatico-baby-pink/20 text-gelatico-pink"
                  : "border-muted-foreground/30 hover:border-gelatico-pink"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
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
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.images[0]?.src || 'https://placehold.co/400'} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/70 backdrop-blur-sm text-gelatico-pink">
                      {product.tags?.split(',')[0].trim() || 'Product'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{product.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      ${parseFloat(product.variants[0]?.price || '0').toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="inline-flex items-center justify-center p-2 rounded-full bg-gelatico-pink text-white hover:bg-gelatico-pink/90 transition-all duration-300"
                      aria-label={`Add ${product.title} to cart`}
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-2xl font-gelatico mb-4">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your category filter.</p>
              <button 
                onClick={() => setActiveCategory(null)}
                className="px-4 py-2 rounded-full bg-gelatico-pink text-white hover:bg-gelatico-pink/90 transition-all duration-300"
              >
                View All Products
              </button>
            </div>
          )}
        </motion.div>
        
        {/* Gift Cards Highlight */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="my-20 p-10 bg-gradient-to-r from-gelatico-baby-pink/30 to-gelatico-soft-blue/30 rounded-3xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-white/50 backdrop-blur-sm text-gelatico-pink text-sm font-medium uppercase tracking-wider">
                Perfect Gift
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-gelatico mb-4">
                Gelatico Gift Cards
              </h2>
              <p className="text-muted-foreground mb-6">
                Share the joy of premium gelato with someone special. Our digital gift cards are delivered instantly 
                via email and can be redeemed at any Gelatico location or in our online shop.
              </p>
              <button 
                onClick={() => setActiveCategory("Gift Cards")}
                className="gelatico-button"
              >
                View Gift Cards
              </button>
            </div>
            <div className="relative">
              <img 
                src="/public/lovable-uploads/4b999340-0478-451a-bd04-7ed0eba14eb5.png" 
                alt="Gelatico Gift Card" 
                className="rounded-2xl shadow-soft"
              />
              <div className="absolute -bottom-5 -right-5 w-32 h-32 rounded-full bg-gelatico-pink opacity-10 z-0"></div>
            </div>
          </div>
        </motion.section>
      </div>
      
      <Footer />
    </div>
  );
}

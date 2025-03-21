
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
    id: "coconutty",
    title: "Coconutty Gelato",
    image: "/public/lovable-uploads/08ff6f2d-b912-4096-9a20-d31d7c5dc7ea.png",
    price: "1.900"
  },
  {
    id: "bubblegum",
    title: "Bubblegum Gelato",
    image: "/public/lovable-uploads/68fdfc78-f84f-4411-b18a-ab7ce14b9128.png", 
    price: "1.900"
  },
  {
    id: "oreo",
    title: "Oreo Gelato",
    image: "/public/lovable-uploads/6bc2aabc-0a5a-4554-a821-4dd77f9c8aea.png",
    price: "1.900"
  },
  {
    id: "vanilla",
    title: "Vanilla Gelato",
    image: "/public/lovable-uploads/91b50f06-99cd-4593-938f-fabd0d114f7b.png",
    price: "1.900"
  },
  {
    id: "cafe-espresso",
    title: "Cafe Espresso Gelato",
    image: "/public/lovable-uploads/08f8de83-510c-4b2c-b0f2-757448f1874c.png",
    price: "1.900"
  },
  {
    id: "becca-selvatica",
    title: "Becca Selvatica Gelato",
    image: "/public/lovable-uploads/bef4f851-ea34-4b80-ae6b-5f8094f7fe6c.png",
    price: "1.900"
  },
  {
    id: "chocolicious",
    title: "Chocolicious Gelato",
    image: "/public/lovable-uploads/c13867b5-479c-403b-a532-b17b6554c0b6.png",
    price: "1.900"
  },
  {
    id: "strawberry-cheesecake",
    title: "Strawberry Cheesecake Gelato",
    image: "/public/lovable-uploads/45be5889-006a-4270-a4ee-872ed44d60d1.png",
    price: "1.900"
  },
  {
    id: "lotus",
    title: "Lotus Gelato",
    image: "/public/lovable-uploads/08d5a940-b374-4d78-be3f-e5525d651fe6.png",
    price: "1.900"
  },
  {
    id: "creme-caramel",
    title: "Creme Caramel Gelato",
    image: "/public/lovable-uploads/121dee10-adac-45ae-8ece-eaa383e8e50b.png",
    price: "1.900"
  },
  {
    id: "pistachio",
    title: "Pistachio Gelato",
    image: "/public/lovable-uploads/2a94f97e-5d11-4c16-a825-93e84c05349d.png",
    price: "1.900"
  },
  // Sorbets
  {
    id: "passion-fruit",
    title: "Passion Fruit Sorbet",
    image: "/public/lovable-uploads/30d31163-952c-46c0-bbdf-0d6cdce4644f.png",
    price: "1.900"
  },
  {
    id: "lemon-mint",
    title: "Lemon Mint Sorbet",
    image: "/public/lovable-uploads/c80c3756-ab46-4f52-8c9f-5331b5964be1.png",
    price: "1.900"
  },
  {
    id: "fragola",
    title: "Fragola Sorbet",
    image: "/public/lovable-uploads/f157d2dd-07de-44d1-b4dd-9cf9d433db54.png",
    price: "1.900"
  },
  {
    id: "tropical-fusion",
    title: "Tropical Fusion Sorbet",
    image: "/public/lovable-uploads/8b030dc4-c8c6-4050-8198-0a33c9fdd312.png",
    price: "1.900"
  },
  {
    id: "mango",
    title: "Mango Sorbet",
    image: "/public/lovable-uploads/b46d4ebf-e0ea-4c47-89b9-0c15123ec875.png",
    price: "1.900"
  },
  {
    id: "raspberry",
    title: "Raspberry Sorbet",
    image: "/public/lovable-uploads/abcafc13-aa1b-452e-a560-7e729fb20e0c.png",
    price: "1.900"
  }
];

// Additional new images
const additionalImages = [
  {
    id: "milk-shake-strawberry",
    title: "Strawberry Milkshake",
    image: "/public/lovable-uploads/6e2cb952-a736-44cf-9688-34ddc202a542.png",
    price: "2.500",
    tags: "Milkshakes"
  },
  {
    id: "milk-shake-pistachio",
    title: "Pistachio Milkshake",
    image: "/public/lovable-uploads/85bd8d12-912e-4165-a3b1-a06f09e4360d.png",
    price: "2.500",
    tags: "Milkshakes"
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
        const localProducts = [...flavorImages, ...additionalImages].map(flavor => ({
          id: flavor.id,
          title: flavor.title,
          description: `Premium ${flavor.title.toLowerCase().includes('sorbet') ? 'Italian sorbet' : flavor.title.toLowerCase().includes('milkshake') ? 'creamy milkshake' : 'Italian gelato'} made with the finest ingredients.`,
          handle: flavor.id,
          images: [{ src: flavor.image }],
          variants: [{ id: `${flavor.id}-regular`, price: flavor.price, title: "Regular Size" }],
          tags: flavor.tags || (flavor.title.toLowerCase().includes('sorbet') ? "Sorbet" : flavor.title.toLowerCase().includes('milkshake') ? "Milkshakes" : "Gelato")
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
      title: "Gelatico Gift Card - 25 KD",
      description: "Share the joy of gelato with friends and family. A perfect gift for any occasion.",
      handle: "gift-card-25",
      images: [{ src: "/public/lovable-uploads/4b999340-0478-451a-bd04-7ed0eba14eb5.png" }],
      variants: [{ id: "gift-card-25-variant", price: "25.000", title: "Default" }],
      tags: "Gift Cards"
    },
    {
      id: "gift-card-50",
      title: "Gelatico Gift Card - 50 KD",
      description: "Share the joy of gelato with friends and family. A perfect gift for any occasion.",
      handle: "gift-card-50",
      images: [{ src: "/public/lovable-uploads/4b999340-0478-451a-bd04-7ed0eba14eb5.png" }],
      variants: [{ id: "gift-card-50-variant", price: "50.000", title: "Default" }],
      tags: "Gift Cards"
    },
    ...flavorImages.map(flavor => ({
      id: flavor.id,
      title: flavor.title,
      description: `Premium Italian gelato made with the finest ingredients.`,
      handle: flavor.id,
      images: [{ src: flavor.image }],
      variants: [{ id: `${flavor.id}-regular`, price: flavor.price, title: "Regular Size" }],
      tags: flavor.title.toLowerCase().includes('sorbet') ? "Sorbet" : "Gelato"
    }))
  ] as ShopifyProduct[];

  // Format price in KWD
  const formatPrice = (price: string) => {
    return `${parseFloat(price).toFixed(3)} KWD`;
  };

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
                      {formatPrice(product.variants[0]?.price || '0')}
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

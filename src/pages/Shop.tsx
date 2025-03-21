
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from "sonner";
import { shopifyService, ShopifyProduct, CartItem } from '@/services/shopify';
import ShopPageHeader from '@/components/shop/ShopPageHeader';
import CategoryFilter from '@/components/shop/CategoryFilter';
import ProductGrid from '@/components/shop/ProductGrid';
import GiftCardHighlight from '@/components/shop/GiftCardHighlight';

// Define gelato flavors using the uploaded images
const flavorImages = [
  {
    id: "coconutty",
    title: "Coconutty Gelato",
    image: "/public/lovable-uploads/08ff6f2d-b912-4096-9a20-d31d7c5dc7ea.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "bubblegum",
    title: "Bubblegum Gelato",
    image: "/public/lovable-uploads/68fdfc78-f84f-4411-b18a-ab7ce14b9128.png", 
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "oreo",
    title: "Oreo Gelato",
    image: "/public/lovable-uploads/6bc2aabc-0a5a-4554-a821-4dd77f9c8aea.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "vanilla",
    title: "Vanilla Gelato",
    image: "/public/lovable-uploads/91b50f06-99cd-4593-938f-fabd0d114f7b.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "cafe-espresso",
    title: "Cafe Espresso Gelato",
    image: "/public/lovable-uploads/08f8de83-510c-4b2c-b0f2-757448f1874c.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "becca-selvatica",
    title: "Becca Selvatica Gelato",
    image: "/public/lovable-uploads/bef4f851-ea34-4b80-ae6b-5f8094f7fe6c.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "chocolicious",
    title: "Chocolicious Gelato",
    image: "/public/lovable-uploads/c13867b5-479c-403b-a532-b17b6554c0b6.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "strawberry-cheesecake",
    title: "Strawberry Cheesecake Gelato",
    image: "/public/lovable-uploads/45be5889-006a-4270-a4ee-872ed44d60d1.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "lotus",
    title: "Lotus Gelato",
    image: "/public/lovable-uploads/08d5a940-b374-4d78-be3f-e5525d651fe6.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "creme-caramel",
    title: "Creme Caramel Gelato",
    image: "/public/lovable-uploads/121dee10-adac-45ae-8ece-eaa383e8e50b.png",
    price: "1.900",
    tags: "Gelato"
  },
  {
    id: "pistachio",
    title: "Pistachio Gelato",
    image: "/public/lovable-uploads/2a94f97e-5d11-4c16-a825-93e84c05349d.png",
    price: "1.900",
    tags: "Gelato"
  },
  // Sorbets
  {
    id: "passion-fruit",
    title: "Passion Fruit Sorbet",
    image: "/public/lovable-uploads/30d31163-952c-46c0-bbdf-0d6cdce4644f.png",
    price: "1.900",
    tags: "Sorbet"
  },
  {
    id: "lemon-mint",
    title: "Lemon Mint Sorbet",
    image: "/public/lovable-uploads/c80c3756-ab46-4f52-8c9f-5331b5964be1.png",
    price: "1.900",
    tags: "Sorbet"
  },
  {
    id: "fragola",
    title: "Fragola Sorbet",
    image: "/public/lovable-uploads/f157d2dd-07de-44d1-b4dd-9cf9d433db54.png",
    price: "1.900",
    tags: "Sorbet"
  },
  {
    id: "tropical-fusion",
    title: "Tropical Fusion Sorbet",
    image: "/public/lovable-uploads/8b030dc4-c8c6-4050-8198-0a33c9fdd312.png",
    price: "1.900",
    tags: "Sorbet"
  },
  {
    id: "mango",
    title: "Mango Sorbet",
    image: "/public/lovable-uploads/b46d4ebf-e0ea-4c47-89b9-0c15123ec875.png",
    price: "1.900",
    tags: "Sorbet"
  },
  {
    id: "raspberry",
    title: "Raspberry Sorbet",
    image: "/public/lovable-uploads/abcafc13-aa1b-452e-a560-7e729fb20e0c.png",
    price: "1.900",
    tags: "Sorbet"
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
          tags: flavor.tags
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
      tags: flavor.tags
    }))
  ] as ShopifyProduct[];

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

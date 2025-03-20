
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingBag } from 'lucide-react';
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "gift-card-25",
      name: "Gelatico Gift Card - $25",
      description: "Share the joy of gelato with friends and family. A perfect gift for any occasion.",
      price: 25,
      image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1287&auto=format&fit=crop",
      category: "Gift Cards"
    },
    {
      id: "gift-card-50",
      name: "Gelatico Gift Card - $50",
      description: "Share the joy of gelato with friends and family. A perfect gift for any occasion.",
      price: 50,
      image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1287&auto=format&fit=crop",
      category: "Gift Cards"
    },
    {
      id: "gelato-box-8",
      name: "Gelato Party Box - 8 Flavors",
      description: "A selection of 8 of our most popular flavors, perfect for gatherings or special occasions.",
      price: 55.99,
      image: "https://images.unsplash.com/photo-1579954115563-e72bf1381629?q=80&w=1287&auto=format&fit=crop",
      category: "Gelato Boxes"
    },
    {
      id: "gelato-box-4",
      name: "Gelato Sampler Box - 4 Flavors",
      description: "Try a variety of our signature flavors with this perfect sampler for 2-4 people.",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1557142046-c704a3adf364?q=80&w=1287&auto=format&fit=crop",
      category: "Gelato Boxes"
    },
    {
      id: "ice-cream-scoop",
      name: "Premium Gelato Scoop",
      description: "Our ergonomic gelato scoop designed for the perfect serve every time.",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1627308595658-1a5632c31eda?q=80&w=1335&auto=format&fit=crop",
      category: "Accessories"
    },
    {
      id: "waffle-bowl-maker",
      name: "Waffle Bowl Maker",
      description: "Create homemade waffle bowls with this easy-to-use maker for an authentic gelato experience.",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?q=80&w=1170&auto=format&fit=crop",
      category: "Accessories"
    },
    {
      id: "gelatico-tshirt",
      name: "Gelatico Logo T-Shirt",
      description: "Soft, comfortable cotton t-shirt featuring our signature Gelatico logo.",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1064&auto=format&fit=crop",
      category: "Merchandise"
    },
    {
      id: "gelatico-hat",
      name: "Gelatico Cap",
      description: "Stylish adjustable cap with embroidered Gelatico logo.",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1170&auto=format&fit=crop",
      category: "Merchandise"
    }
  ]);
  
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  const filteredProducts = activeCategory 
    ? products.filter(product => product.category === activeCategory) 
    : products;
  
  const addToCart = (product: Product) => {
    toast.success(`${product.name} added to your cart!`);
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
            Explore our collection of gift cards, gelato party boxes, and Gelatico branded merchandise. 
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
          {filteredProducts.map((product) => (
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
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/70 backdrop-blur-sm text-gelatico-pink">
                    {product.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-gelatico-pink text-white hover:bg-gelatico-pink/90 transition-all duration-300"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
                src="https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1287&auto=format&fit=crop" 
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

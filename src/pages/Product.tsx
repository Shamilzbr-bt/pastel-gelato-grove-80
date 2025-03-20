
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Flavor } from '@/components/FlavorCard';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [flavor, setFlavor] = useState<Flavor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('regular');
  
  // Mock getting flavor data
  useEffect(() => {
    setIsLoading(true);
    
    // This would be a fetch to your API in a real application
    setTimeout(() => {
      const mockFlavor: Flavor = {
        id: "strawberry-dream",
        name: "Strawberry Dream",
        description: "Creamy gelato bursting with real strawberry pieces and a hint of vanilla. Each scoop brings you the taste of fresh summer strawberries, picked at the peak of ripeness and blended into our signature gelato base.",
        image: "https://images.unsplash.com/photo-1557142046-c704a3adf364?q=80&w=687&auto=format&fit=crop",
        price: 4.99,
        tags: ["Classic", "Seasonal"],
        ingredients: ["Milk", "Cream", "Sugar", "Strawberries", "Vanilla extract"],
        nutritionalInfo: {
          calories: 220,
          fat: 12,
          carbs: 25,
          protein: 3,
        },
        pairings: ["Chocolate Chip", "Pistachio", "Lemon Sorbet"]
      };
      
      setFlavor(mockFlavor);
      setIsLoading(false);
    }, 800);
  }, [id]);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (flavor) {
      toast.success(`${quantity} ${quantity > 1 ? 'scoops' : 'scoop'} of ${flavor.name} added to your cart!`);
    }
  };
  
  const getTagClass = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower === 'vegan') return 'flavor-tag-vegan';
    if (tagLower === 'dairy-free') return 'flavor-tag-dairy-free';
    if (tagLower === 'sugar-free') return 'flavor-tag-sugar-free';
    if (tagLower === 'classic') return 'flavor-tag-classic';
    if (tagLower === 'seasonal') return 'flavor-tag-seasonal';
    return 'bg-gray-100 text-gray-800';
  };

  // Size options for the product
  const sizeOptions = [
    { id: 'small', name: 'Small', price: flavor?.price ? flavor.price - 1 : 3.99 },
    { id: 'regular', name: 'Regular', price: flavor?.price || 4.99 },
    { id: 'large', name: 'Large', price: flavor?.price ? flavor.price + 2 : 6.99 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
        <Link 
          to="/flavors" 
          className="inline-flex items-center mb-8 text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Flavors
        </Link>
        
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full border-4 border-gelatico-baby-pink border-t-gelatico-pink animate-spin"></div>
          </div>
        ) : flavor ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden shadow-soft"
            >
              <img 
                src={flavor.image} 
                alt={flavor.name} 
                className="w-full h-full object-cover aspect-square lg:aspect-auto lg:h-[500px]"
              />
              
              {/* Tags overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap max-w-[calc(100%-32px)]">
                {flavor.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={cn("flavor-tag", getTagClass(tag))}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
            
            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold font-gelatico mb-4">
                {flavor.name}
              </h1>
              
              <p className="text-muted-foreground mb-6">
                {flavor.description}
              </p>
              
              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="flex space-x-4">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.id}
                      className={cn(
                        "px-4 py-2 rounded-full border-2 transition-all duration-300",
                        selectedSize === size.id
                          ? "border-gelatico-pink bg-gelatico-baby-pink/20 text-gelatico-pink"
                          : "border-muted-foreground/30 hover:border-gelatico-pink"
                      )}
                      onClick={() => setSelectedSize(size.id)}
                    >
                      {size.name} - ${size.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <p className="text-muted-foreground">
                  {flavor.ingredients?.join(', ')}
                </p>
              </div>
              
              {/* Nutritional Info */}
              {flavor.nutritionalInfo && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Nutritional Information</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded-xl bg-muted">
                      <p className="text-sm text-muted-foreground">Calories</p>
                      <p className="font-semibold">{flavor.nutritionalInfo.calories}</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted">
                      <p className="text-sm text-muted-foreground">Fat</p>
                      <p className="font-semibold">{flavor.nutritionalInfo.fat}g</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted">
                      <p className="text-sm text-muted-foreground">Carbs</p>
                      <p className="font-semibold">{flavor.nutritionalInfo.carbs}g</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted">
                      <p className="text-sm text-muted-foreground">Protein</p>
                      <p className="font-semibold">{flavor.nutritionalInfo.protein}g</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Perfect Pairings */}
              {flavor.pairings && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Perfect Pairings</h3>
                  <p className="text-muted-foreground">
                    {flavor.pairings.join(', ')}
                  </p>
                </div>
              )}
              
              {/* Add to Cart Section */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-muted-foreground/30 rounded-full overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="px-4 py-2 text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="w-10 text-center">{quantity}</span>
                  
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="px-4 py-2 text-muted-foreground hover:text-gelatico-pink transition-colors duration-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                
                <Button 
                  onClick={handleAddToCart}
                  className="gelatico-button flex-1 sm:flex-none"
                >
                  <ShoppingBag className="mr-2" size={18} />
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Flavor Not Found</h2>
            <p className="text-muted-foreground mb-6">
              Sorry, we couldn't find the flavor you're looking for.
            </p>
            <Link to="/flavors" className="gelatico-button">
              Browse All Flavors
            </Link>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

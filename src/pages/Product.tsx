
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
import ToppingsSelector from '@/components/product/ToppingsSelector';
import ContainerSelector, { ContainerOption } from '@/components/product/ContainerSelector';

interface Topping {
  id: string;
  name: string;
  price: number;
  category: 'addons' | 'sauces';
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [flavor, setFlavor] = useState<Flavor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContainer, setSelectedContainer] = useState('cup-minio');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  
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
        price: 1.900,
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

  const handleToppingsChange = (toppings: Topping[]) => {
    setSelectedToppings(toppings);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!flavor) return 0;
    
    // Container price
    const containerOptions: ContainerOption[] = [
      { id: 'cup-minio', type: 'cup', size: 'minio', name: 'Minio Cup', price: 1.900, description: 'Single scoop cup' },
      { id: 'cup-medio', type: 'cup', size: 'medio', name: 'Medio Cup', price: 2.900, description: 'Double scoop cup' },
      { id: 'cup-megano', type: 'cup', size: 'megano', name: 'Megano Cup', price: 3.900, description: 'Triple scoop cup' },
      { id: 'cone-standard', type: 'cone', size: 'standard', name: 'Standard Cone', price: 1.900, description: 'Single scoop cone' },
      { id: 'cone-tower', type: 'cone', size: 'tower', name: 'Tower Cone', price: 2.900, description: 'Double scoop cone' },
    ];
    
    const selectedOption = containerOptions.find(option => option.id === selectedContainer);
    const containerPrice = selectedOption?.price || flavor.price;
    
    // Toppings price
    const toppingsPriceTotal = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
    
    // Total for one item
    const singleItemPrice = containerPrice + toppingsPriceTotal;
    
    // Multiply by quantity
    return singleItemPrice * quantity;
  };

  const handleAddToCart = () => {
    if (flavor) {
      const toppingsText = selectedToppings.length > 0 
        ? ` with ${selectedToppings.map(t => t.name).join(', ')}` 
        : '';
      
      const containerOptions: ContainerOption[] = [
        { id: 'cup-minio', type: 'cup', size: 'minio', name: 'Minio Cup', price: 1.900, description: 'Single scoop cup' },
        { id: 'cup-medio', type: 'cup', size: 'medio', name: 'Medio Cup', price: 2.900, description: 'Double scoop cup' },
        { id: 'cup-megano', type: 'cup', size: 'megano', name: 'Megano Cup', price: 3.900, description: 'Triple scoop cup' },
        { id: 'cone-standard', type: 'cone', size: 'standard', name: 'Standard Cone', price: 1.900, description: 'Single scoop cone' },
        { id: 'cone-tower', type: 'cone', size: 'tower', name: 'Tower Cone', price: 2.900, description: 'Double scoop cone' },
      ];
      
      const selectedOption = containerOptions.find(option => option.id === selectedContainer);
      
      toast.success(`${quantity} ${selectedOption?.name || ''} of ${flavor.name}${toppingsText} added to your cart!`);
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
              
              {/* Container Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Choose Your Container</h3>
                <ContainerSelector
                  selectedContainer={selectedContainer}
                  setSelectedContainer={setSelectedContainer}
                />
              </div>
              
              {/* Toppings Selection */}
              <div className="mb-6">
                <ToppingsSelector onSelectToppings={handleToppingsChange} maxSelections={3} />
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
              
              {/* Price and Add to Cart Section */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Total</h3>
                  <span className="text-xl font-bold">{calculateTotalPrice().toFixed(3)} KD</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
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

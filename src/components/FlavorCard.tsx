
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface Flavor {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  tags: string[];
  ingredients?: string[];
  nutritionalInfo?: {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  };
  pairings?: string[];
}

interface FlavorCardProps {
  flavor: Flavor;
  layout?: 'grid' | 'featured';
}

export default function FlavorCard({ flavor, layout = 'grid' }: FlavorCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${flavor.name} added to your cart!`);
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
    <motion.div
      whileHover={layout === 'grid' ? { y: -8 } : undefined}
      className={cn(
        "group overflow-hidden",
        layout === 'grid' 
          ? "h-full rounded-2xl transition-all duration-300 shadow-soft hover:shadow-hover"
          : "flex flex-col md:flex-row items-start gap-8 my-12 p-6 rounded-3xl bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm shadow-soft"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/flavors/${flavor.id}`} 
        className="block h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn(
          "relative overflow-hidden", 
          layout === 'grid' ? "aspect-square" : "md:w-[300px] w-full aspect-square md:aspect-auto rounded-xl overflow-hidden"
        )}>
          <motion.img
            src={flavor.image}
            alt={flavor.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
            initial={false}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Tags overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap max-w-[calc(100%-24px)]">
            {flavor.tags.map((tag, index) => (
              <span 
                key={index} 
                className={cn("flavor-tag", getTagClass(tag))}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className={cn(
          "p-4",
          layout === 'featured' && "md:flex-1"
        )}>
          <h3 className="text-xl font-bold font-gelatico mb-2 group-hover:text-gelatico-pink transition-colors duration-300">
            {flavor.name}
          </h3>
          
          <p className="text-muted-foreground mb-3 line-clamp-2">
            {flavor.description}
          </p>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-semibold text-foreground">
              ${flavor.price.toFixed(2)}
            </span>
            
            <div className="flex items-center space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full border-gelatico-pink text-gelatico-pink hover:bg-gelatico-baby-pink hover:bg-opacity-20"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Info size={18} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                  <div className="relative aspect-video">
                    <img 
                      src={flavor.image} 
                      alt={flavor.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6">
                        <h2 className="text-white text-2xl font-bold mb-2 font-gelatico">{flavor.name}</h2>
                        <div className="flex flex-wrap">
                          {flavor.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className={cn("flavor-tag", getTagClass(tag))}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground mb-4">{flavor.description}</p>
                    
                    {flavor.ingredients && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                        <p className="text-muted-foreground mb-4">{flavor.ingredients.join(', ')}</p>
                      </>
                    )}
                    
                    {flavor.nutritionalInfo && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-2 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Calories</p>
                            <p className="font-semibold">{flavor.nutritionalInfo.calories}</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Fat</p>
                            <p className="font-semibold">{flavor.nutritionalInfo.fat}g</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Carbs</p>
                            <p className="font-semibold">{flavor.nutritionalInfo.carbs}g</p>
                          </div>
                          <div className="text-center p-2 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">Protein</p>
                            <p className="font-semibold">{flavor.nutritionalInfo.protein}g</p>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {flavor.pairings && (
                      <>
                        <h3 className="text-lg font-semibold mb-2">Perfect Pairings</h3>
                        <p className="text-muted-foreground">{flavor.pairings.join(', ')}</p>
                      </>
                    )}
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        className="rounded-full bg-gelatico-pink hover:bg-gelatico-pink/90 text-white"
                        onClick={handleAddToCart}
                      >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="default" 
                size="icon" 
                className="rounded-full bg-gelatico-pink hover:bg-gelatico-pink/90 text-white"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

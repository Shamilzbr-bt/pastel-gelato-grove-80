
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Flavor } from "@/models/Flavor";
import FlavorTags from "./FlavorTags";
import NutritionalInfo from "./NutritionalInfo";

interface FlavorDetailDialogProps {
  flavor: Flavor;
  onAddToCart: (e: React.MouseEvent) => void;
}

export default function FlavorDetailDialog({ flavor, onAddToCart }: FlavorDetailDialogProps) {
  // Function to clean image path
  const cleanImagePath = (path: string) => {
    // Remove /public prefix if it exists
    if (path.startsWith('/public/')) {
      return path.substring(7);
    }
    return path;
  };
  
  return (
    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
      <div className="relative aspect-video">
        <img 
          src={cleanImagePath(flavor.image)} 
          alt={flavor.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/lovable-uploads/67ee37cc-aeb4-47ed-a49a-f40b0216fac1.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-6">
            <h2 className="text-white text-2xl font-bold mb-2 font-gelatico">{flavor.name}</h2>
            <FlavorTags tags={flavor.tags} />
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
          <NutritionalInfo nutritionalInfo={flavor.nutritionalInfo} />
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
            onClick={onAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

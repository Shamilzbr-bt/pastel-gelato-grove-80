
import { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Topping {
  id: string;
  name: string;
  price: number;
  category: 'addons' | 'sauces';
}

interface ToppingsSelectorProps {
  selectedToppings: string[];
  onToppingsChange: (toppings: string[]) => void;
  maxSelections?: number;
}

export default function ToppingsSelector({ selectedToppings, onToppingsChange, maxSelections = 3 }: ToppingsSelectorProps) {
  const toppings: Topping[] = [
    // Add-ons
    { id: 'marshmallow', name: 'Marshmallow', price: 0.250, category: 'addons' },
    { id: 'oreo', name: 'Oreo Crumbs', price: 0.250, category: 'addons' },
    { id: 'sprinkles', name: 'Sprinkles', price: 0.250, category: 'addons' },
    { id: 'nuts', name: 'Mixed Nuts', price: 0.250, category: 'addons' },
    { id: 'brownies', name: 'Brownie Pieces', price: 0.250, category: 'addons' },
    
    // Sauces
    { id: 'chocolate', name: 'Chocolate Sauce', price: 0.250, category: 'sauces' },
    { id: 'caramel', name: 'Caramel Sauce', price: 0.250, category: 'sauces' },
    { id: 'pistachio', name: 'Pistachio Sauce', price: 0.250, category: 'sauces' },
    { id: 'strawberry', name: 'Strawberry Sauce', price: 0.250, category: 'sauces' },
    { id: 'honey', name: 'Honey', price: 0.250, category: 'sauces' },
  ];
  
  const addonsOptions = toppings.filter(topping => topping.category === 'addons');
  const saucesOptions = toppings.filter(topping => topping.category === 'sauces');
  
  const toggleTopping = (topping: Topping) => {
    let newSelection;
    // Check if this topping is already selected
    const isSelected = selectedToppings.includes(topping.id);
    
    if (isSelected) {
      // Remove the topping if already selected
      newSelection = selectedToppings.filter(id => id !== topping.id);
    } else {
      // Add the topping if not at max selections
      if (selectedToppings.length < maxSelections) {
        newSelection = [...selectedToppings, topping.id];
      } else {
        // At max selections, don't change
        newSelection = selectedToppings;
      }
    }
    
    // Notify parent component of the change
    onToppingsChange(newSelection);
  };
  
  const isToppingSelected = (id: string) => selectedToppings.includes(id);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Add-ons (Select up to {maxSelections})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {addonsOptions.map((topping) => (
            <button
              key={topping.id}
              onClick={() => toggleTopping(topping)}
              className={cn(
                "relative px-4 py-3 rounded-xl border-2 text-left transition-all",
                isToppingSelected(topping.id)
                  ? "border-gelatico-pink bg-gelatico-baby-pink/10"
                  : "border-muted-foreground/20 hover:border-gelatico-pink/50"
              )}
            >
              <span className="block font-medium">{topping.name}</span>
              <span className="block text-sm text-muted-foreground">
                +{topping.price.toFixed(3)} KD
              </span>
              {isToppingSelected(topping.id) && (
                <div className="absolute top-2 right-2 bg-gelatico-pink rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Sauces</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {saucesOptions.map((topping) => (
            <button
              key={topping.id}
              onClick={() => toggleTopping(topping)}
              className={cn(
                "relative px-4 py-3 rounded-xl border-2 text-left transition-all",
                isToppingSelected(topping.id)
                  ? "border-gelatico-pink bg-gelatico-baby-pink/10"
                  : "border-muted-foreground/20 hover:border-gelatico-pink/50"
              )}
            >
              <span className="block font-medium">{topping.name}</span>
              <span className="block text-sm text-muted-foreground">
                +{topping.price.toFixed(3)} KD
              </span>
              {isToppingSelected(topping.id) && (
                <div className="absolute top-2 right-2 bg-gelatico-pink rounded-full p-1">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

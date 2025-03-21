
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ContainerOption = {
  id: string;
  type: 'cup' | 'cone';
  size: string;
  name: string;
  price: number;
  description: string;
};

interface ContainerSelectorProps {
  selectedContainer: string;
  setSelectedContainer: (value: string) => void;
}

export default function ContainerSelector({ 
  selectedContainer, 
  setSelectedContainer 
}: ContainerSelectorProps) {
  const containerOptions: ContainerOption[] = [
    // Cup options
    { 
      id: 'cup-minio', 
      type: 'cup', 
      size: 'minio', 
      name: 'Minio Cup', 
      price: 1.900,
      description: 'Single scoop cup' 
    },
    { 
      id: 'cup-medio', 
      type: 'cup', 
      size: 'medio', 
      name: 'Medio Cup', 
      price: 2.900,
      description: 'Double scoop cup' 
    },
    { 
      id: 'cup-megano', 
      type: 'cup', 
      size: 'megano', 
      name: 'Megano Cup', 
      price: 3.900,
      description: 'Triple scoop cup' 
    },
    
    // Cone options
    { 
      id: 'cone-standard', 
      type: 'cone', 
      size: 'standard', 
      name: 'Standard Cone', 
      price: 1.900,
      description: 'Single scoop cone' 
    },
    { 
      id: 'cone-tower', 
      type: 'cone', 
      size: 'tower', 
      name: 'Tower Cone', 
      price: 2.900,
      description: 'Double scoop cone' 
    },
  ];
  
  const cupOptions = containerOptions.filter(option => option.type === 'cup');
  const coneOptions = containerOptions.filter(option => option.type === 'cone');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Cup Options</h3>
        <RadioGroup
          value={selectedContainer}
          onValueChange={setSelectedContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {cupOptions.map((option) => (
            <Label
              key={option.id}
              htmlFor={option.id}
              className={cn(
                "cursor-pointer flex flex-col p-4 rounded-xl border-2 transition-all",
                selectedContainer === option.id
                  ? "border-gelatico-pink bg-gelatico-baby-pink/10"
                  : "border-muted-foreground/20 hover:border-gelatico-pink/30"
              )}
            >
              <RadioGroupItem 
                value={option.id} 
                id={option.id} 
                className="sr-only" 
              />
              <span className="block text-lg font-medium">{option.name}</span>
              <span className="block text-sm text-muted-foreground mb-2">
                {option.description}
              </span>
              <span className="text-gelatico-pink font-semibold">
                {option.price.toFixed(3)} KD
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Cone Options</h3>
        <RadioGroup
          value={selectedContainer}
          onValueChange={setSelectedContainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {coneOptions.map((option) => (
            <Label
              key={option.id}
              htmlFor={option.id}
              className={cn(
                "cursor-pointer flex flex-col p-4 rounded-xl border-2 transition-all",
                selectedContainer === option.id
                  ? "border-gelatico-pink bg-gelatico-baby-pink/10"
                  : "border-muted-foreground/20 hover:border-gelatico-pink/30"
              )}
            >
              <RadioGroupItem 
                value={option.id} 
                id={option.id} 
                className="sr-only" 
              />
              <span className="block text-lg font-medium">{option.name}</span>
              <span className="block text-sm text-muted-foreground mb-2">
                {option.description}
              </span>
              <span className="text-gelatico-pink font-semibold">
                {option.price.toFixed(3)} KD
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

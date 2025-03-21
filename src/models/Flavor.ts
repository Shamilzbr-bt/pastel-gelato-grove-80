
export interface Flavor {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  nutrition?: {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
    sugar?: number;
  };
  featured?: boolean;
  price?: string;
  category?: string;
  variants?: {
    id: string;
    name: string;
    price: string;
  }[];
  ingredients?: string[];
  pairings?: string[];
  nutritionalInfo?: string;
}

// Helper to check if a flavor is a sorbet
export function isSorbet(flavor: Flavor): boolean {
  return flavor.tags.some(tag => 
    tag.toLowerCase() === 'sorbet' || 
    flavor.name.toLowerCase().includes('sorbet')
  );
}

// Helper to get the primary category of a flavor
export function getFlavorCategory(flavor: Flavor): string {
  if (isSorbet(flavor)) return 'Sorbet';
  if (flavor.tags.some(tag => tag.toLowerCase().includes('milkshake'))) return 'Milkshake';
  return 'Gelato';
}

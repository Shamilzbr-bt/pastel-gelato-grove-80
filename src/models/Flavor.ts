
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

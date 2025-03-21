
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  return (
    <div className="flex justify-center flex-wrap gap-2 mb-12">
      <button
        className={`px-4 py-2 rounded-full border-2 transition-all duration-300 ${
          activeCategory === null
            ? "border-gelatico-pink bg-gelatico-baby-pink/20 text-gelatico-pink"
            : "border-muted-foreground/30 hover:border-gelatico-pink"
        }`}
        onClick={() => onCategoryChange(null)}
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
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

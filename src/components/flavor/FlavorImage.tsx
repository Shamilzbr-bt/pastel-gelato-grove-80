
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from "@/lib/utils";
import FlavorTags from './FlavorTags';

interface FlavorImageProps {
  image: string;
  name: string;
  tags: string[];
  layout?: 'grid' | 'featured';
}

export default function FlavorImage({ image, name, tags, layout = 'grid' }: FlavorImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Function to clean image path
  const cleanImagePath = (path: string) => {
    // Remove /public prefix if it exists
    if (path.startsWith('/public/')) {
      return path.substring(7);
    }
    return path;
  };
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        layout === 'grid' ? "aspect-square" : "md:w-[300px] w-full aspect-square md:aspect-auto rounded-xl overflow-hidden"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        src={cleanImagePath(image)}
        alt={name}
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        initial={false}
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.5 }}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://placehold.co/800x600/e81cff/ffffff?text=Missing+Image';
        }}
      />
      
      {/* Tags overlay */}
      <FlavorTags tags={tags} className="absolute top-3 left-3 max-w-[calc(100%-24px)]" />
    </div>
  );
}

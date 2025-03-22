
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FlavorGrid from '@/components/FlavorGrid';
import { Flavor } from '@/models/Flavor';
import { flavorImages } from '@/data/products';

export default function Flavors() {
  const [flavors, setFlavors] = useState<Flavor[]>([]);

  useEffect(() => {
    // Convert flavorImages to Flavor[] and filter out tropical-fusion and mango
    const filteredFlavorImages = flavorImages.filter(flavor => 
      !["tropical-fusion", "mango"].includes(flavor.id)
    );
    
    const mappedFlavors: Flavor[] = filteredFlavorImages.map(flavor => ({
      id: flavor.id,
      name: flavor.title,
      description: flavor.description || `Premium ${flavor.title.toLowerCase().includes('sorbet') ? 'Italian sorbet' : 'Italian gelato'} made with the finest ingredients.`,
      image: flavor.image,
      tags: [flavor.tags],
      price: parseFloat(flavor.price),
    }));
    
    setFlavors(mappedFlavors);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            Explore Our Selection
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-gelatico mb-6 text-gelatico-pink">
            Our Flavors
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our range of handcrafted gelato and sorbet flavors, made fresh daily using the finest ingredients.
            From traditional Italian classics to innovative seasonal creations, there's something for everyone.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FlavorGrid flavors={flavors} />
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}

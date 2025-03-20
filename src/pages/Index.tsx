
import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import LocationFinder from '@/components/LocationFinder';
import Footer from '@/components/Footer';
import FlavorGrid from '@/components/FlavorGrid';
import { Flavor } from '@/components/FlavorCard';
import { motion } from 'framer-motion';

export default function Index() {
  const [flavors, setFlavors] = useState<Flavor[]>([
    {
      id: "strawberry-dream",
      name: "Strawberry Dream",
      description: "Creamy gelato bursting with real strawberry pieces and a hint of vanilla.",
      image: "https://images.unsplash.com/photo-1557142046-c704a3adf364?q=80&w=687&auto=format&fit=crop",
      price: 4.99,
      tags: ["Classic", "Seasonal"],
      ingredients: ["Milk", "Cream", "Sugar", "Strawberries", "Vanilla extract"],
      nutritionalInfo: {
        calories: 220,
        fat: 12,
        carbs: 25,
        protein: 3,
      },
      pairings: ["Chocolate Chip", "Pistachio", "Lemon Sorbet"]
    },
    {
      id: "pistachio-paradise",
      name: "Pistachio Paradise",
      description: "Rich pistachio gelato made with imported Sicilian pistachios for the most authentic taste.",
      image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?q=80&w=1074&auto=format&fit=crop",
      price: 5.49,
      tags: ["Classic", "Vegan"],
      ingredients: ["Almond milk", "Pistachio paste", "Pistachios", "Sugar", "Coconut oil"],
      nutritionalInfo: {
        calories: 240,
        fat: 14,
        carbs: 20,
        protein: 5,
      },
      pairings: ["Chocolate", "Vanilla", "Hazelnut"]
    },
    {
      id: "mango-tango",
      name: "Mango Tango",
      description: "Refreshing mango sorbet with a hint of lime for the perfect tropical escape.",
      image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=1170&auto=format&fit=crop",
      price: 4.99,
      tags: ["Seasonal", "Dairy-Free", "Vegan"],
      ingredients: ["Mangoes", "Sugar", "Water", "Lime juice", "Mango puree"],
      nutritionalInfo: {
        calories: 180,
        fat: 0,
        carbs: 35,
        protein: 1,
      },
      pairings: ["Coconut", "Passion Fruit", "Raspberry Sorbet"]
    },
    {
      id: "chocolate-decadence",
      name: "Chocolate Decadence",
      description: "Indulgent dark chocolate gelato with rich cocoa and Belgian chocolate chunks.",
      image: "https://images.unsplash.com/photo-1581084324492-c8076f130f86?q=80&w=1170&auto=format&fit=crop",
      price: 5.49,
      tags: ["Classic"],
      ingredients: ["Milk", "Cream", "Sugar", "Dark chocolate", "Cocoa powder", "Belgian chocolate chunks"],
      nutritionalInfo: {
        calories: 260,
        fat: 15,
        carbs: 28,
        protein: 4,
      },
      pairings: ["Vanilla", "Hazelnut", "Caramel Swirl"]
    },
    {
      id: "lemon-bliss",
      name: "Lemon Bliss",
      description: "Tangy lemon sorbet that perfectly balances sweetness and citrus for a refreshing treat.",
      image: "https://images.unsplash.com/photo-1555949581-b60ff2e48a73?q=80&w=1170&auto=format&fit=crop",
      price: 4.99,
      tags: ["Seasonal", "Dairy-Free", "Vegan"],
      ingredients: ["Lemons", "Sugar", "Water", "Lemon zest"],
      nutritionalInfo: {
        calories: 165,
        fat: 0,
        carbs: 30,
        protein: 0,
      },
      pairings: ["Raspberry Sorbet", "Strawberry", "Blueberry Swirl"]
    },
    {
      id: "vanilla-bean",
      name: "Vanilla Bean",
      description: "Classic vanilla gelato made with premium Madagascar vanilla beans and fresh cream.",
      image: "https://images.unsplash.com/photo-1591209581947-878ee812a822?q=80&w=1170&auto=format&fit=crop",
      price: 4.99,
      tags: ["Classic"],
      ingredients: ["Milk", "Cream", "Sugar", "Madagascar vanilla beans", "Egg yolks"],
      nutritionalInfo: {
        calories: 210,
        fat: 12,
        carbs: 22,
        protein: 3,
      },
      pairings: ["Chocolate", "Strawberry", "Coffee"]
    }
  ]);

  return (
    <div className="min-h-screen">
      <Hero />
      
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-20 bg-white"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
              Taste the Difference
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-gelatico mb-6">
              Our Featured Flavors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each scoop of Gelatico gelato is handcrafted daily using the freshest, highest-quality ingredients. 
              Here are some of our customers' favorite flavors.
            </p>
          </div>
          
          <FlavorGrid flavors={flavors} featured={true} />
          
          <div className="text-center mt-12">
            <a href="/flavors" className="gelatico-button">
              View All Flavors
            </a>
          </div>
        </div>
      </motion.section>
      
      <AboutSection />
      
      <LocationFinder />
      
      <Footer />
    </div>
  );
}

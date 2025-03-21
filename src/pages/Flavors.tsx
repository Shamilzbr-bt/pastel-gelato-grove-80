import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FlavorGrid from '@/components/FlavorGrid';
import { Flavor } from '@/models/Flavor';

export default function Flavors() {
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
    },
    {
      id: "caramel-swirl",
      name: "Caramel Swirl",
      description: "Velvety gelato with ribbons of house-made salted caramel throughout.",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1287&auto=format&fit=crop",
      price: 5.49,
      tags: ["Classic"],
      ingredients: ["Milk", "Cream", "Sugar", "Caramel", "Sea salt"],
      nutritionalInfo: {
        calories: 245,
        fat: 13,
        carbs: 28,
        protein: 3,
      },
      pairings: ["Chocolate", "Vanilla", "Pistachio"]
    },
    {
      id: "coconut-paradise",
      name: "Coconut Paradise",
      description: "Creamy coconut gelato made with coconut milk and topped with toasted coconut flakes.",
      image: "https://images.unsplash.com/photo-1639135768080-4e186df02c64?q=80&w=1170&auto=format&fit=crop",
      price: 5.49,
      tags: ["Vegan", "Dairy-Free"],
      ingredients: ["Coconut milk", "Sugar", "Coconut cream", "Toasted coconut flakes"],
      nutritionalInfo: {
        calories: 230,
        fat: 15,
        carbs: 22,
        protein: 2,
      },
      pairings: ["Mango Tango", "Chocolate", "Pineapple Sorbet"]
    },
    {
      id: "hazelnut-heaven",
      name: "Hazelnut Heaven",
      description: "Rich hazelnut gelato with fragments of caramelized hazelnuts for the perfect crunch.",
      image: "https://images.unsplash.com/photo-1628341207331-27d3b0d8765c?q=80&w=1170&auto=format&fit=crop",
      price: 5.99,
      tags: ["Classic"],
      ingredients: ["Milk", "Cream", "Sugar", "Hazelnuts", "Hazelnut paste"],
      nutritionalInfo: {
        calories: 255,
        fat: 15,
        carbs: 23,
        protein: 5,
      },
      pairings: ["Chocolate", "Vanilla", "Coffee"]
    },
    {
      id: "mint-chocolate-chip",
      name: "Mint Chocolate Chip",
      description: "Refreshing mint gelato with dark chocolate chips and a cool finish.",
      image: "https://images.unsplash.com/photo-1563589425757-f33edf2ab656?q=80&w=1170&auto=format&fit=crop",
      price: 5.49,
      tags: ["Classic"],
      ingredients: ["Milk", "Cream", "Sugar", "Mint extract", "Dark chocolate chips"],
      nutritionalInfo: {
        calories: 235,
        fat: 13,
        carbs: 26,
        protein: 3,
      },
      pairings: ["Chocolate", "Vanilla", "Cookies & Cream"]
    },
    {
      id: "raspberry-sorbet",
      name: "Raspberry Sorbet",
      description: "Intensely flavored raspberry sorbet made with fresh berries for a bright, fruity experience.",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b19c?q=80&w=1036&auto=format&fit=crop",
      price: 4.99,
      tags: ["Seasonal", "Dairy-Free", "Vegan"],
      ingredients: ["Raspberries", "Sugar", "Water", "Lemon juice"],
      nutritionalInfo: {
        calories: 170,
        fat: 0,
        carbs: 32,
        protein: 1,
      },
      pairings: ["Lemon Bliss", "Dark Chocolate", "Vanilla Bean"]
    },
    {
      id: "tiramisu-treat",
      name: "Tiramisu Treat",
      description: "Italian classic reimagined as gelato with coffee-soaked ladyfingers and mascarpone cream.",
      image: "https://images.unsplash.com/photo-1551879400-111a9087cd86?q=80&w=1287&auto=format&fit=crop",
      price: 5.99,
      tags: ["Classic"],
      ingredients: ["Milk", "Cream", "Sugar", "Mascarpone", "Coffee", "Ladyfingers", "Cocoa"],
      nutritionalInfo: {
        calories: 265,
        fat: 14,
        carbs: 29,
        protein: 4,
      },
      pairings: ["Coffee", "Chocolate", "Vanilla"]
    }
  ]);

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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-gelatico mb-6">
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

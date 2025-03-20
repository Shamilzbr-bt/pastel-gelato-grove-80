
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1563589425592-91b756f0a91b?q=80&w=2048&auto=format&fit=crop",
      subheading: "Handcrafted with Love",
      heading: "Artisanal Gelato",
      description: "Experience the authentic taste of Italy with our premium, small-batch gelato made from the finest ingredients."
    },
    {
      image: "https://images.unsplash.com/photo-1572451479139-6a308211d8be?q=80&w=2048&auto=format&fit=crop",
      subheading: "New Season Flavors",
      heading: "Summer Collection",
      description: "Discover our refreshing seasonal flavors, crafted to bring joy to those hot summer days."
    },
    {
      image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2048&auto=format&fit=crop",
      subheading: "Pure Indulgence",
      heading: "Exquisite Taste",
      description: "Savor the moment with our rich, creamy gelato - an experience that transcends ordinary ice cream."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 245, 225, 0.7), rgba(255, 209, 220, 0.7)), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            key={`subheading-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block px-4 py-1 mb-4 rounded-full bg-white/50 backdrop-blur-sm text-gelatico-pink text-sm font-medium uppercase tracking-wider"
          >
            {slides[currentSlide].subheading}
          </motion.p>
          
          <motion.h1
            key={`heading-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground font-gelatico mb-6"
          >
            {slides[currentSlide].heading}
          </motion.h1>
          
          <motion.p
            key={`description-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
          >
            {slides[currentSlide].description}
          </motion.p>
          
          <motion.div
            key={`buttons-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/shop" className="gelatico-button">
              Shop Now
            </Link>
            <Link to="/flavors" className="gelatico-button-outline">
              Explore Flavors
            </Link>
          </motion.div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-gelatico-pink w-8' : 'bg-white/70 hover:bg-white'
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-[5%] left-[5%] w-20 h-20 rounded-full bg-gelatico-pink bg-opacity-10 animate-float" />
      <div className="absolute top-[15%] right-[10%] w-16 h-16 rounded-full bg-gelatico-soft-blue bg-opacity-20 animate-pulse-soft" />
      <div className="absolute top-[30%] left-[8%] w-12 h-12 rounded-full bg-gelatico-baby-pink bg-opacity-30 animate-rotate-slow" />
    </section>
  );
}

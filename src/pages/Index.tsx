
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { Flavor } from '@/models/Flavor';
import AboutSection from '@/components/AboutSection';
import FlavorGrid from '@/components/FlavorGrid';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const Index = () => {
  const [featuredFlavors, setFeaturedFlavors] = useState<Flavor[]>([]);

  useEffect(() => {
    // Mock data for featured flavors with new images
    const mockFlavors: Flavor[] = [
      {
        id: "coconutty",
        name: "Coconutty Gelato",
        description: "Creamy coconut gelato with toasted coconut flakes.",
        image: "/lovable-uploads/d520fc48-b67a-4391-bbce-95a3f93c8450.png",
        tags: ["Gelato", "Coconut"],
        featured: true,
        price: "1.900",
        variants: [{ id: "coconutty-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "pistacchio",
        name: "Pistachio Delight",
        description: "Authentic pistachio gelato made from premium Italian nuts.",
        image: "/lovable-uploads/3e7425e2-b89a-494a-ad3c-654d86a90ec6.png",
        tags: ["Gelato", "Pistachio", "Nuts"],
        featured: true,
        price: "1.900",
        variants: [{ id: "pistachio-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "chocolate",
        name: "Double Chocolate",
        description: "Rich dark chocolate gelato with chocolate chunks.",
        image: "/lovable-uploads/5711393c-4796-46a9-a939-478166f02cbf.png",
        tags: ["Gelato", "Chocolate"],
        featured: true,
        price: "1.900",
        variants: [{ id: "chocolate-regular", name: "Regular", price: "1.900" }]
      }
    ];

    setFeaturedFlavors(mockFlavors);
  }, []);

  return (
    <>
      <AnimatedBackground />
      <Header />
      <Hero />
      <AboutSection />

      {/* Featured Flavors Section */}
      <section className="py-16 bg-gelatico-light-yellow bg-opacity-80 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-gelatico mb-8">
            Featured Flavors
          </h2>
          <FlavorGrid flavors={featuredFlavors} />
          <Link to="/flavors" className="inline-flex items-center mt-8 gelatico-button">
            View All Flavors
            <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Index;

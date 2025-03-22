
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { Flavor } from '@/models/Flavor';
import AboutSection from '@/components/AboutSection';
import FlavorGrid from '@/components/FlavorGrid';
import PopularToppings from '@/components/PopularToppings';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [featuredFlavors, setFeaturedFlavors] = useState<Flavor[]>([]);

  useEffect(() => {
    // Mock data for featured flavors
    const mockFlavors: Flavor[] = [
      {
        id: "coconutty",
        name: "Coconutty Gelato",
        description: "Creamy coconut gelato with toasted coconut flakes.",
        image: "/public/lovable-uploads/08ff6f2d-b912-4096-9a20-d31d7c5dc7ea.png",
        tags: ["Gelato", "Coconut"],
        featured: true,
        price: "1.900",
        variants: [{ id: "coconutty-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "bubblegum",
        name: "Bubblegum Gelato",
        description: "Classic bubblegum flavored gelato that's fun for all ages.",
        image: "/public/lovable-uploads/68fdfc78-f84f-4411-b18a-ab7ce14b9128.png",
        tags: ["Gelato", "Bubblegum"],
        featured: true,
        price: "1.900",
        variants: [{ id: "bubblegum-regular", name: "Regular", price: "1.900" }]
      },
      {
        id: "oreo",
        name: "Oreo Gelato",
        description: "Delicious cookies and cream gelato with real Oreo pieces.",
        image: "/public/lovable-uploads/6bc2aabc-0a5a-4554-a821-4dd77f9c8aea.png",
        tags: ["Gelato", "Oreo"],
        featured: true,
        price: "1.900",
        variants: [{ id: "oreo-regular", name: "Regular", price: "1.900" }]
      }
    ];

    setFeaturedFlavors(mockFlavors);
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <AboutSection />

      {/* Featured Flavors Section */}
      <section className="py-16 bg-gelatico-light-yellow">
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
      
      {/* Add Popular Toppings Section */}
      <PopularToppings />

      <Footer />
    </>
  );
};

export default Index;

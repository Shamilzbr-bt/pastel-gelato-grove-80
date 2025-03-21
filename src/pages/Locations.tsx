
import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Phone, Clock, ExternalLink, Mail } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  hours: string;
  description: string;
  image: string;
  mapUrl: string;
}

export default function Locations() {
  const [activeLocation, setActiveLocation] = useState(0);
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 1,
      name: 'Boulevard Mall',
      address: 'Boulevard Mall',
      city: 'Salmiya, Kuwait',
      phone: '+965 5555-5555',
      email: 'boulevard@gelatico.com',
      hours: 'Mon-Sun: 10am - 10pm',
      description: 'Our flagship store located in Boulevard Mall, Salmiya, featuring our full range of gelato flavors and a cozy seating area perfect for enjoying your treat.',
      image: 'https://images.unsplash.com/photo-1631651738795-b89313168669?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.app.goo.gl/u4fMJ32aN3y8oin1A'
    },
    {
      id: 2,
      name: 'AlKout Mall',
      address: 'AlKout Mall',
      city: 'Fahaheel, Kuwait',
      phone: '+965 5555-5555',
      email: 'alkout@gelatico.com',
      hours: 'Mon-Sun: 10am - 10pm',
      description: 'Located in the popular AlKout Mall in Fahaheel, this location offers a perfect spot to cool down with our delicious gelato after shopping.',
      image: 'https://images.unsplash.com/photo-1532704868953-d5f3aae5b98a?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.app.goo.gl/W9gG28bFzkXSstzF8'
    },
    {
      id: 3,
      name: 'Dome Mall',
      address: 'Dome Mall',
      city: 'Abu Halifa, Kuwait',
      phone: '+965 5555-5555',
      email: 'dome@gelatico.com',
      hours: 'Mon-Sun: 10am - 10pm',
      description: 'Our Dome Mall location in Abu Halifa features exclusive flavors and a beautiful interior design for a perfect gelato experience.',
      image: 'https://images.unsplash.com/photo-1631651740656-5c479a041f39?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.app.goo.gl/yBnCh7tJ8k5C6ic87'
    },
    {
      id: 4,
      name: 'Khiran Mall',
      address: 'Khiran Mall',
      city: 'Al Khiran, Kuwait',
      phone: '+965 5555-5555',
      email: 'khiran@gelatico.com',
      hours: 'Mon-Sun: 10am - 10pm',
      description: 'Visit our Khiran Mall location for refreshing gelato and sorbet flavors perfect for hot days.',
      image: 'https://images.unsplash.com/photo-1631651738795-b89313168669?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.app.goo.gl/jT6kSncwRou2pR629'
    },
    {
      id: 5,
      name: 'Sama Mall',
      address: 'Sama Mall',
      city: 'Ahmadi, Kuwait',
      phone: '+965 5555-5555',
      email: 'sama@gelatico.com',
      hours: 'Mon-Sun: 10am - 10pm',
      description: 'Our Sama Mall location in Ahmadi offers a wide variety of our signature flavors in a welcoming environment.',
      image: 'https://images.unsplash.com/photo-1532704868953-d5f3aae5b98a?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.app.goo.gl/ck4CC5BBEowQzpK86'
    },
    {
      id: 6,
      name: 'Sulaiyal Mall',
      address: 'Sulaiyal Mall',
      city: 'Jahra, Kuwait',
      phone: '+965 5555-5555',
      email: 'sulaiyal@gelatico.com',
      hours: 'Mon-Sun: 10am - 10pm',
      description: 'Experience our artisanal gelato at Sulaiyal Mall in Jahra, with comfortable seating and a friendly atmosphere.',
      image: 'https://images.unsplash.com/photo-1631651740656-5c479a041f39?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.app.goo.gl/idKXxVU3XmneZ2Z18'
    },
    {
      id: 7,
      name: 'Homz Mall',
      address: 'Homz Mall',
      city: 'Dajeej, Kuwait',
      phone: '+965 5555-5555',
      email: 'homz@gelatico.com',
      hours: 'Mon-Sun: 10am - 10pm',
      description: 'Our newest location at Homz Mall in Dajeej, featuring all your favorite gelato flavors and our signature service.',
      image: 'https://images.unsplash.com/photo-1631651738795-b89313168669?q=80&w=1287&auto=format&fit=crop',
      mapUrl: 'https://maps.app.goo.gl/eGnn2AYzRbC9qrFB6'
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
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            Visit Us
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-gelatico mb-6">
            Our Locations
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find a Gelatico near you across Kuwait and experience our artisanal gelato in person. Each location offers our signature flavors along with special local creations.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {locations.map((location, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              key={location.id}
              className={`rounded-3xl overflow-hidden shadow-soft transition-all duration-300 hover:shadow-hover ${
                activeLocation === index ? 'ring-2 ring-gelatico-pink' : ''
              }`}
              onClick={() => setActiveLocation(index)}
            >
              <div className="aspect-[16/9] relative">
                <img 
                  src={location.image} 
                  alt={location.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-6">
                    <h2 className="text-white text-2xl font-bold font-gelatico">{location.name}</h2>
                    <p className="text-white/80">{location.city}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-muted-foreground mb-4">{location.description}</p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin size={18} className="text-gelatico-pink mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      {location.address}<br />{location.city}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={18} className="text-gelatico-pink flex-shrink-0" />
                    <p className="text-muted-foreground">{location.phone}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail size={18} className="text-gelatico-pink flex-shrink-0" />
                    <p className="text-muted-foreground">{location.email}</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock size={18} className="text-gelatico-pink mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground whitespace-pre-line">{location.hours}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <a 
                    href={location.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 rounded-full bg-gelatico-pink text-white hover:bg-gelatico-pink/90 transition-all duration-300"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    View on Map
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold font-gelatico mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about our locations or interested in franchise opportunities? Get in touch with our team.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-soft p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-gelatico-pink"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-gelatico-pink"
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-gelatico-pink"
                  placeholder="Subject of your message"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-gelatico-pink"
                  placeholder="Your message"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="gelatico-button w-full"
              >
                Send Message
              </button>
            </form>
          </div>
        </motion.section>
      </div>
      
      <Footer />
    </div>
  );
}

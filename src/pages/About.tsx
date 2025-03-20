
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Leaf, Smile } from 'lucide-react';

export default function About() {
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
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-gelatico mb-6">
            About Gelatico
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the passion, craftsmanship, and love that goes into every scoop of Gelatico. 
            From our humble beginnings to our commitment to quality, get to know the story behind our gelato.
          </p>
        </motion.div>
        
        {/* Our Beginning */}
        <StorySection
          title="Our Beginning"
          description="Gelatico was born from a simple yet powerful idea: to create the most authentic and delicious gelato outside of Italy. Our founder, Sophia, fell in love with gelato during her years studying culinary arts in Florence. Trained by renowned Italian gelato maestros, she learned the traditional techniques and recipes that had been passed down through generations."
          image="https://images.unsplash.com/photo-1579954115567-dff2eeb6fdeb?q=80&w=1170&auto=format&fit=crop"
          imageAlt="Gelatico founder making gelato"
          reverse={false}
        />
        
        {/* Our Philosophy */}
        <StorySection
          title="Our Philosophy"
          description="At Gelatico, we believe that exceptional gelato comes from exceptional ingredients. We source locally whenever possible, partnering with farmers who share our commitment to quality and sustainability. Every flavor is handcrafted in small batches daily, ensuring that each scoop offers the perfect texture and taste experience. We never use artificial preservatives, colors, or flavors – just real, honest ingredients prepared with expertise and care."
          image="https://images.unsplash.com/photo-1529589789467-4a12ccb8e5ff?q=80&w=1170&auto=format&fit=crop"
          imageAlt="Fresh ingredients for gelato"
          reverse={true}
        />
        
        {/* Our Commitment */}
        <StorySection
          title="Our Commitment"
          description="Sustainability isn't just a buzzword for us – it's a core value that guides everything we do. From our biodegradable packaging to our energy-efficient production processes, we're constantly looking for ways to reduce our environmental footprint. We also believe in giving back to our community, which is why a portion of every purchase goes to supporting local food security initiatives and education programs."
          image="https://images.unsplash.com/photo-1651950883237-0e422aa8a5cd?q=80&w=1287&auto=format&fit=crop"
          imageAlt="Eco-friendly packaging and sustainable practices"
          reverse={false}
        />
        
        {/* Values Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
              What We Stand For
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-gelatico mb-6">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              At the heart of Gelatico are core principles that guide our business practices, our relationships, and our craftsmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              icon={<Award className="text-gelatico-pink" size={36} />}
              title="Quality Excellence"
              description="We never compromise on the quality of our ingredients or our process. From sourcing the finest ingredients to the final scoop, excellence is our standard."
            />
            <ValueCard
              icon={<Leaf className="text-gelatico-pink" size={36} />}
              title="Sustainability"
              description="We're committed to reducing our environmental impact through sustainable sourcing, eco-friendly packaging, and responsible waste management."
            />
            <ValueCard
              icon={<Smile className="text-gelatico-pink" size={36} />}
              title="Joy & Connection"
              description="We believe gelato is about creating moments of joy and connection. Every scoop is crafted to bring people together and create lasting memories."
            />
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20 bg-gelatico-peach-cream/30 rounded-3xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 mb-4 rounded-full bg-white backdrop-blur-sm text-gelatico-pink text-sm font-medium uppercase tracking-wider">
              Meet Our Team
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold font-gelatico mb-6">
              The People Behind Gelatico
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our talented team of gelato artisans, flavor innovators, and friendly staff are the heart and soul of Gelatico.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
            <TeamMember
              name="Sophia Martinez"
              role="Founder & Head Gelato Chef"
              image="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1122&auto=format&fit=crop"
            />
            <TeamMember
              name="Marco Rossi"
              role="Master Flavor Developer"
              image="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1287&auto=format&fit=crop"
            />
            <TeamMember
              name="Emma Chen"
              role="Operations Director"
              image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1288&auto=format&fit=crop"
            />
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
}

interface StorySectionProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

function StorySection({ title, description, image, imageAlt, reverse = false }: StorySectionProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="py-16">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          reverse ? 'lg:flex lg:flex-row-reverse' : ''
        }`}
      >
        {/* Image Side */}
        <motion.div variants={itemVariants} className="relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft">
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Decorative elements */}
          <div className={`absolute -top-8 ${reverse ? '-right-8' : '-left-8'} w-32 h-32 rounded-full bg-gelatico-baby-pink opacity-20 z-0`}></div>
          <div className={`absolute -bottom-10 ${reverse ? '-left-10' : '-right-10'} w-40 h-40 rounded-full bg-gelatico-soft-blue opacity-20 z-0`}></div>
        </motion.div>

        {/* Content Side */}
        <div className={reverse ? 'lg:pr-10' : 'lg:pl-10'}>
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold font-gelatico mb-6 leading-tight">
            {title}
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-muted-foreground mb-6">
            {description}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6 }
        }
      }}
      className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all duration-300"
    >
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
}

function TeamMember({ name, role, image }: TeamMemberProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6 }
        }
      }}
      className="group"
    >
      <div className="relative rounded-2xl overflow-hidden shadow-soft aspect-[3/4] mb-4 group-hover:shadow-hover transition-all duration-300">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <h3 className="text-xl font-bold font-gelatico">{name}</h3>
      <p className="text-muted-foreground">{role}</p>
    </motion.div>
  );
}

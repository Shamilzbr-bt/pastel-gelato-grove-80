
import { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

export default function AboutSection() {
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
    <section className="py-20 overflow-hidden bg-gradient-to-b from-white to-gelatico-peach-cream/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Image Side */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1587563974670-b5181b459b30?auto=format&fit=crop&q=80&w=1287"
                alt="Artisanal gelato making"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gelatico-baby-pink opacity-20 z-0"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-gelatico-soft-blue opacity-20 z-0"></div>
          </motion.div>

          {/* Content Side */}
          <div className="lg:pl-10">
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
                Our Story
              </span>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold font-gelatico mb-6 leading-tight">
              Crafting Moments of Pure Delight
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-muted-foreground mb-6">
              Founded in 2015, Gelatico began with a simple vision: to create the most authentic 
              and delicious gelato outside of Italy. Our founder, Sophia, spent years in Florence 
              studying the art of gelato-making under renowned Italian maestros.
            </motion.p>
            
            <motion.p variants={itemVariants} className="text-muted-foreground mb-8">
              Today, each scoop of our gelato is still handcrafted daily in small batches, 
              using locally-sourced ingredients and traditional techniques. We believe in 
              quality over quantity, sustainability, and delivering moments of pure joy 
              through our creations.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <Link to="/about" className="gelatico-button">
                Learn More About Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

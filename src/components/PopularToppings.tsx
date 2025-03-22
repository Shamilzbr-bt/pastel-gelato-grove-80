
import React from 'react';
import { motion } from 'framer-motion';

interface Topping {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function PopularToppings() {
  const toppings: Topping[] = [
    {
      id: 'chocolate',
      name: 'Chocolate Sauce',
      description: 'Rich, decadent chocolate sauce',
      image: '/public/lovable-uploads/91b50f06-99cd-4593-938f-fabd0d114f7b.png'
    },
    {
      id: 'marshmallow',
      name: 'Marshmallows',
      description: 'Fluffy, sweet marshmallows',
      image: '/public/lovable-uploads/45be5889-006a-4270-a4ee-872ed44d60d1.png'
    },
    {
      id: 'nuts',
      name: 'Mixed Nuts',
      description: 'Crunchy, toasted mixed nuts',
      image: '/public/lovable-uploads/f157d2dd-07de-44d1-b4dd-9cf9d433db54.png'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto text-center"
      >
        <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
          Enhance Your Gelato
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-gelatico mb-8">
          Popular Toppings
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
          Take your gelato experience to the next level with our selection of premium toppings.
        </p>

        <div className="flex flex-wrap justify-center gap-8">
          {toppings.map((topping) => (
            <div key={topping.id} className="container-3d mx-auto">
              <div className="canvas">
                {[...Array(25)].map((_, index) => (
                  <div key={index} className={`tr-${index + 1}`}></div>
                ))}
              </div>
              <div id="card-3d">
                <img 
                  src={topping.image} 
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-60 z-0"
                  alt={topping.name}
                />
                <p id="prompt-3d">{topping.name}</p>
                <div className="title-3d">{topping.name}</div>
                <p className="subtitle-3d">{topping.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

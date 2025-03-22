
import { Button } from "@/components/ui/button";
import StarBorder from "@/components/StarBorder";
import { motion } from "framer-motion";

const toppings = [
  { name: "Chocolate Sprinkles", color: "#e81cff" },
  { name: "Crushed Oreos", color: "#40c9ff" },
  { name: "Rainbow Sprinkles", color: "#fc00ff" },
  { name: "Caramel Sauce", color: "#00dbde" }
];

export default function PopularToppings() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-gelatico mb-12 text-center">
          Popular Toppings
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {toppings.map((topping, index) => (
            <motion.div
              key={topping.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <StarBorder 
                as="div"
                color={topping.color}
                className="w-full mb-4 h-52"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <h3 className="text-xl font-bold mb-2">{topping.name}</h3>
                  <p className="text-sm text-gray-300">Perfect for any flavor!</p>
                </div>
              </StarBorder>
              
              <Button 
                variant="default" 
                className="mt-2"
              >
                Add to Order
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

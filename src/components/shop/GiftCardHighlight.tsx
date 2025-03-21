
import { motion } from 'framer-motion';

interface GiftCardHighlightProps {
  onViewGiftCards: () => void;
}

export default function GiftCardHighlight({ onViewGiftCards }: GiftCardHighlightProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="my-20 p-10 bg-gradient-to-r from-gelatico-baby-pink/30 to-gelatico-soft-blue/30 rounded-3xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-white/50 backdrop-blur-sm text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            Perfect Gift
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-gelatico mb-4">
            Gelatico Gift Cards
          </h2>
          <p className="text-muted-foreground mb-6">
            Share the joy of premium gelato with someone special. Our digital gift cards are delivered instantly 
            via email and can be redeemed at any Gelatico location or in our online shop.
          </p>
          <button 
            onClick={onViewGiftCards}
            className="gelatico-button"
          >
            View Gift Cards
          </button>
        </div>
        <div className="relative">
          <img 
            src="/public/lovable-uploads/4b999340-0478-451a-bd04-7ed0eba14eb5.png" 
            alt="Gelatico Gift Card" 
            className="rounded-2xl shadow-soft"
          />
          <div className="absolute -bottom-5 -right-5 w-32 h-32 rounded-full bg-gelatico-pink opacity-10 z-0"></div>
        </div>
      </div>
    </motion.section>
  );
}


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// This is a mock service for favorites - you'll need to implement a real one
const favoritesService = {
  getFavorites: async () => {
    // Mock data for demonstration purposes
    return {
      success: true,
      favorites: [
        {
          id: '1',
          product_id: '123',
          name: 'Strawberry Gelato',
          price: 3.5,
          image_url: '/lovable-uploads/08d5a940-b374-4d78-be3f-e5525d651fe6.png',
          description: 'Creamy strawberry gelato made with fresh strawberries',
        },
        {
          id: '2',
          product_id: '456',
          name: 'Chocolate Chunk',
          price: 3.5,
          image_url: '/lovable-uploads/08f8de83-510c-4b2c-b0f2-757448f1874c.png',
          description: 'Rich chocolate gelato with chunks of premium chocolate',
        },
        {
          id: '3',
          product_id: '789',
          name: 'Pistachio Dream',
          price: 3.8,
          image_url: '/lovable-uploads/08ff6f2d-b912-4096-9a20-d31d7c5dc7ea.png',
          description: 'Authentic pistachio flavor with real pistachio pieces',
        },
      ]
    };
  },
  
  removeFavorite: async (id: string) => {
    // Mock implementation
    return { success: true };
  }
};

export default function Favorites() {
  const queryClient = useQueryClient();
  
  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ['userFavorites'],
    queryFn: favoritesService.getFavorites,
  });
  
  const removeFavoriteMutation = useMutation({
    mutationFn: (id: string) => favoritesService.removeFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      toast.success('Removed from favorites');
    },
    onError: () => {
      toast.error('Failed to remove from favorites');
    }
  });
  
  const favorites = favoritesData?.success ? favoritesData.favorites : [];
  
  // Function to add to cart - would be implemented in a real app
  const handleAddToCart = (product: any) => {
    toast.success(`${product.name} added to cart!`);
  };
  
  const handleRemoveFromFavorites = (id: string) => {
    removeFavoriteMutation.mutate(id);
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            My Favorites
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">Favorite Products</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your saved ice cream flavors and products
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Your Favorites</CardTitle>
              <CardDescription>Products you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-6">You haven't added any products to your favorites list.</p>
                  <Button asChild>
                    <Link to="/shop">Shop Now</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((item: any) => (
                    <div key={item.id} className="border rounded-md overflow-hidden group relative">
                      <Link to={`/product/${item.product_id}`} className="block">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.image_url} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                        </div>
                      </Link>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 bg-white/80 text-red-500 hover:bg-white/90 hover:text-red-600"
                        onClick={() => handleRemoveFromFavorites(item.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                      
                      <div className="p-4">
                        <Link to={`/product/${item.product_id}`} className="block">
                          <h3 className="font-medium text-lg mb-1 hover:text-gelatico-pink">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.price.toFixed(3)} KD</span>
                          <Button 
                            size="sm" 
                            onClick={() => handleAddToCart(item)}
                            className="h-8"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" /> Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

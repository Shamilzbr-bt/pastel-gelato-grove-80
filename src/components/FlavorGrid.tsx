
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlavorCard, { Flavor } from './FlavorCard';
import { Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

interface FlavorGridProps {
  flavors: Flavor[];
  featured?: boolean;
}

export default function FlavorGrid({ flavors, featured = false }: FlavorGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredFlavors, setFilteredFlavors] = useState<Flavor[]>(flavors);
  
  const allCategories = Array.from(
    new Set(flavors.flatMap(flavor => flavor.tags))
  ).sort();

  useEffect(() => {
    const filtered = flavors.filter(flavor => {
      const matchesSearch = flavor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          flavor.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.some(cat => flavor.tags.includes(cat));
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredFlavors(filtered);
  }, [flavors, searchQuery, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  return (
    <div className="w-full">
      {!featured && (
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search flavors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border-0 shadow-soft rounded-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <Filter className="mr-2" size={18} />
                  Filter
                  {selectedCategories.length > 0 && (
                    <span className="ml-2 bg-gelatico-pink text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {selectedCategories.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allCategories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
                {selectedCategories.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-muted-foreground"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      
      {featured ? (
        // Featured layout - one by one
        <div className="space-y-6">
          {filteredFlavors.slice(0, 3).map((flavor) => (
            <FlavorCard key={flavor.id} flavor={flavor} layout="featured" />
          ))}
        </div>
      ) : (
        // Grid layout
        <AnimatePresence>
          {filteredFlavors.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredFlavors.map((flavor) => (
                <motion.div
                  key={flavor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FlavorCard flavor={flavor} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <h3 className="text-2xl font-gelatico mb-4">No flavors found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
              <Button onClick={clearFilters}>Clear filters</Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

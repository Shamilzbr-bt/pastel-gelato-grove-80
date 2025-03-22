
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, PlusCircle, Edit } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock data for demonstration purposes
const mockProducts = [
  {
    id: '1',
    name: 'Chocolate Chunk',
    category: 'Ice Cream',
    price: 3.500,
    stock: 42,
    status: 'in-stock',
    imageUrl: '/lovable-uploads/08f8de83-510c-4b2c-b0f2-757448f1874c.png',
  },
  {
    id: '2',
    name: 'Vanilla Bean',
    category: 'Ice Cream',
    price: 3.250,
    stock: 36,
    status: 'in-stock',
    imageUrl: '/lovable-uploads/c13867b5-479c-403b-a532-b17b6554c0b6.png',
  },
  {
    id: '3',
    name: 'Strawberry Delight',
    category: 'Ice Cream',
    price: 3.500,
    stock: 28,
    status: 'in-stock',
    imageUrl: '/lovable-uploads/08d5a940-b374-4d78-be3f-e5525d651fe6.png',
  },
  {
    id: '4',
    name: 'Mango Tango',
    category: 'Ice Cream',
    price: 3.750,
    stock: 15,
    status: 'low-stock',
    imageUrl: '/lovable-uploads/c80c3756-ab46-4f52-8c9f-5331b5964be1.png',
  },
  {
    id: '5',
    name: 'Pistachio Dream',
    category: 'Ice Cream',
    price: 3.750,
    stock: 8,
    status: 'low-stock',
    imageUrl: '/lovable-uploads/08ff6f2d-b912-4096-9a20-d31d7c5dc7ea.png',
  },
  {
    id: '6',
    name: 'Waffle Cone',
    category: 'Container',
    price: 0.750,
    stock: 120,
    status: 'in-stock',
    imageUrl: '/lovable-uploads/47544c31-489b-43d9-bea9-70fb1cc17910.png',
  },
  {
    id: '7',
    name: 'Cup - Small',
    category: 'Container',
    price: 0.500,
    stock: 85,
    status: 'in-stock',
    imageUrl: '/lovable-uploads/85bd8d12-912e-4165-a3b1-a06f09e4360d.png',
  },
  {
    id: '8',
    name: 'Sprinkles',
    category: 'Topping',
    price: 0.250,
    stock: 3,
    status: 'out-of-stock',
    imageUrl: '/lovable-uploads/4af656c2-e89f-41a0-adc6-f25a01e26357.png',
  },
];

const mockIngredients = [
  { id: '1', name: 'Milk', quantity: '50 liters', status: 'in-stock' },
  { id: '2', name: 'Cream', quantity: '30 liters', status: 'in-stock' },
  { id: '3', name: 'Sugar', quantity: '25 kg', status: 'in-stock' },
  { id: '4', name: 'Chocolate', quantity: '10 kg', status: 'low-stock' },
  { id: '5', name: 'Vanilla Extract', quantity: '2 liters', status: 'low-stock' },
  { id: '6', name: 'Strawberries', quantity: '8 kg', status: 'in-stock' },
  { id: '7', name: 'Mango Puree', quantity: '5 kg', status: 'low-stock' },
  { id: '8', name: 'Pistachio', quantity: '3 kg', status: 'low-stock' },
  { id: '9', name: 'Waffle Mix', quantity: '12 kg', status: 'in-stock' },
  { id: '10', name: 'Paper Cups', quantity: '500 pieces', status: 'in-stock' },
  { id: '11', name: 'Rainbow Sprinkles', quantity: '0.5 kg', status: 'out-of-stock' },
];

export default function AdminInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // This would be replaced with actual API calls in a real implementation
  const { data: inventory, isLoading, refetch } = useQuery({
    queryKey: ['adminInventory', activeTab],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would fetch from your database here
      return {
        products: mockProducts,
        ingredients: mockIngredients,
      };
    },
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter inventory based on search term and active tab
  const filteredItems = activeTab === 'products' 
    ? inventory?.products.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : inventory?.ingredients.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  const handleAddItem = () => {
    // In a real app, you would add the item to your database
    toast.success(`New ${activeTab === 'products' ? 'product' : 'ingredient'} added successfully!`);
    setIsAddDialogOpen(false);
    refetch();
  };
  
  const handleEditItem = () => {
    // In a real app, you would update the item in your database
    toast.success(`Item updated successfully!`);
    setIsEditDialogOpen(false);
    setSelectedItem(null);
    refetch();
  };
  
  const handleUpdateStock = (id: string, newStock: number) => {
    // In a real app, you would update the stock in your database
    toast.success(`Stock updated successfully!`);
    refetch();
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-orange-100 text-orange-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
            Admin Area
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">Inventory Management</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your products, ingredients, and stock levels
          </p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add {activeTab === 'products' ? 'Product' : 'Ingredient'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New {activeTab === 'products' ? 'Product' : 'Ingredient'}</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new {activeTab === 'products' ? 'product' : 'ingredient'} to inventory.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" className="col-span-3" />
                      </div>
                      {activeTab === 'products' && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                              Category
                            </Label>
                            <Input id="category" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                              Price (KD)
                            </Label>
                            <Input id="price" type="number" step="0.001" className="col-span-3" />
                          </div>
                        </>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stock" className="text-right">
                          {activeTab === 'products' ? 'Stock' : 'Quantity'}
                        </Label>
                        <Input id="stock" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleAddItem}>Add Item</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search ${activeTab}...`}
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>Manage your ice cream products and containers</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                    </div>
                  ) : filteredItems && filteredItems.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                                    <img 
                                      src={product.imageUrl || '/placeholder.svg'} 
                                      alt={product.name} 
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="font-medium">{product.name}</div>
                                </div>
                              </TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.price.toFixed(3)} KD</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Input 
                                    type="number" 
                                    defaultValue={product.stock} 
                                    className="w-16 text-center"
                                    min="0"
                                    onChange={(e) => {
                                      // Update stock locally for UI feedback
                                      product.stock = parseInt(e.target.value);
                                    }}
                                    onBlur={(e) => handleUpdateStock(product.id, parseInt(e.target.value))}
                                  />
                                  <span className="text-sm text-muted-foreground">units</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={getStatusBadgeColor(product.status)}
                                >
                                  {product.status === 'in-stock' ? 'In Stock' : 
                                   product.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItem(product);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No products found matching your search.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ingredients">
              <Card>
                <CardHeader>
                  <CardTitle>Ingredients</CardTitle>
                  <CardDescription>Manage your ingredients and supplies</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                    </div>
                  ) : filteredItems && filteredItems.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ingredient</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredItems.map((ingredient) => (
                            <TableRow key={ingredient.id}>
                              <TableCell>
                                <div className="font-medium">{ingredient.name}</div>
                              </TableCell>
                              <TableCell>{ingredient.quantity}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant="outline" 
                                  className={getStatusBadgeColor(ingredient.status)}
                                >
                                  {ingredient.status === 'in-stock' ? 'In Stock' : 
                                   ingredient.status === 'low-stock' ? 'Low Stock' : 'Out of Stock'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItem(ingredient);
                                    setIsEditDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No ingredients found matching your search.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Edit Dialog */}
          {selectedItem && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit {activeTab === 'products' ? 'Product' : 'Ingredient'}</DialogTitle>
                  <DialogDescription>
                    Update details for {selectedItem.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Name
                    </Label>
                    <Input 
                      id="edit-name" 
                      className="col-span-3" 
                      defaultValue={selectedItem.name} 
                    />
                  </div>
                  {activeTab === 'products' && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-category" className="text-right">
                          Category
                        </Label>
                        <Input 
                          id="edit-category" 
                          className="col-span-3" 
                          defaultValue={selectedItem.category} 
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="edit-price" className="text-right">
                          Price (KD)
                        </Label>
                        <Input 
                          id="edit-price" 
                          type="number" 
                          step="0.001" 
                          className="col-span-3" 
                          defaultValue={selectedItem.price} 
                        />
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-stock" className="text-right">
                      {activeTab === 'products' ? 'Stock' : 'Quantity'}
                    </Label>
                    <Input 
                      id="edit-stock" 
                      className="col-span-3" 
                      defaultValue={activeTab === 'products' ? selectedItem.stock : selectedItem.quantity} 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" onClick={handleEditItem}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

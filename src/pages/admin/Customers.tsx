
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Edit, 
  Trash2,
  ShieldAlert,
  ShieldCheck,
  User
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for demonstration purposes
const mockCustomers = [
  {
    id: '1',
    name: 'Ahmed Al-Mansour',
    email: 'ahmed@example.com',
    phone: '+965 5550 1234',
    orders: 8,
    total_spent: 276.50,
    created_at: '2023-01-15T10:00:00Z',
    is_admin: false,
  },
  {
    id: '2',
    name: 'Fatima Al-Qasim',
    email: 'fatima@example.com',
    phone: '+965 5551 5678',
    orders: 5,
    total_spent: 142.25,
    created_at: '2023-02-20T12:30:00Z',
    is_admin: false,
  },
  {
    id: '3',
    name: 'Yousef Al-Harbi',
    email: 'yousef@example.com',
    phone: '+965 5552 9012',
    orders: 12,
    total_spent: 398.75,
    created_at: '2023-03-05T09:15:00Z',
    is_admin: true,
  },
  {
    id: '4',
    name: 'Layla Al-Azmi',
    email: 'layla@example.com',
    phone: '+965 5553 3456',
    orders: 3,
    total_spent: 89.00,
    created_at: '2023-04-12T14:45:00Z',
    is_admin: false,
  },
  {
    id: '5',
    name: 'Mohammad Al-Saqer',
    email: 'mohammad@example.com',
    phone: '+965 5554 7890',
    orders: 7,
    total_spent: 215.25,
    created_at: '2023-05-08T11:20:00Z',
    is_admin: false,
  },
];

export default function AdminCustomers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  
  // This would be replaced with actual API calls in a real implementation
  const { data: customers, isLoading } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would fetch from your database here
      return mockCustomers;
    },
  });
  
  // Delete customer mutation (mock)
  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      toast.success('Customer deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete customer');
    }
  });
  
  // Toggle admin status mutation (mock)
  const toggleAdminStatusMutation = useMutation({
    mutationFn: async ({ id, makeAdmin }: { id: string; makeAdmin: boolean }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] });
      toast.success(`User ${variables.makeAdmin ? 'promoted to admin' : 'removed from admin role'}`);
    },
    onError: () => {
      toast.error('Failed to update admin status');
    }
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter customers based on search term
  const filteredCustomers = customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      deleteCustomerMutation.mutate(selectedCustomer.id);
    }
  };
  
  const handleToggleAdminStatus = (id: string, makeAdmin: boolean) => {
    toggleAdminStatusMutation.mutate({ id, makeAdmin });
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
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
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">Customer Management</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            View and manage your customer base
          </p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>Manage your ice cream shop's customers</CardDescription>
                </div>
                <Button onClick={() => {
                  setSelectedCustomer(null);
                  setIsUserDialogOpen(true);
                }}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search customers..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : filteredCustomers && filteredCustomers.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{customer.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span>{customer.email}</span>
                              </div>
                              <div>{customer.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{customer.orders}</TableCell>
                          <TableCell>{customer.total_spent.toFixed(3)} KD</TableCell>
                          <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {customer.is_admin ? (
                              <div className="flex items-center text-blue-600">
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">Admin</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-1" />
                                <span className="text-sm">Customer</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedCustomer(customer);
                                  setIsUserDialogOpen(true);
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCustomer(customer);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Permissions</DropdownMenuLabel>
                                {customer.is_admin ? (
                                  <DropdownMenuItem
                                    onClick={() => handleToggleAdminStatus(customer.id, false)}
                                  >
                                    <ShieldAlert className="h-4 w-4 mr-2" />
                                    Remove Admin
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleToggleAdminStatus(customer.id, true)}
                                  >
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Make Admin
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No customers found matching your search.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add/Edit Customer Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer ? 'Edit Customer' : 'Add New Customer'}
            </DialogTitle>
            <DialogDescription>
              {selectedCustomer 
                ? 'Update customer information and settings'
                : 'Add a new customer to your store'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name">Full Name</label>
              <Input
                id="name"
                defaultValue={selectedCustomer?.name || ''}
                placeholder="Enter customer's full name"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                type="email"
                defaultValue={selectedCustomer?.email || ''}
                placeholder="Enter email address"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone">Phone</label>
              <Input
                id="phone"
                defaultValue={selectedCustomer?.phone || ''}
                placeholder="Enter phone number"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success(`Customer ${selectedCustomer ? 'updated' : 'added'} successfully`);
              setIsUserDialogOpen(false);
            }}>
              {selectedCustomer ? 'Save Changes' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedCustomer && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-100 rounded-md">
                <Avatar>
                  <AvatarFallback>{getInitials(selectedCustomer.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedCustomer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCustomer} 
              disabled={deleteCustomerMutation.isPending}
            >
              {deleteCustomerMutation.isPending ? 'Deleting...' : 'Delete Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}

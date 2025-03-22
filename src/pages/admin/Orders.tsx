
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Badge } from '@/components/ui/badge';
import { Eye, MoreVertical, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for demonstration purposes
const mockOrders = [
  {
    id: 'ORD-7891',
    customer: 'Ahmed Al-Mansour',
    email: 'ahmed@example.com',
    status: 'processing',
    total: '34.500 KD',
    items: 3,
    date: '2023-06-15T10:00:00Z',
  },
  {
    id: 'ORD-7892',
    customer: 'Fatima Al-Qasim',
    email: 'fatima@example.com',
    status: 'shipped',
    total: '21.750 KD',
    items: 2,
    date: '2023-06-15T09:30:00Z',
  },
  {
    id: 'ORD-7893',
    customer: 'Yousef Al-Harbi',
    email: 'yousef@example.com',
    status: 'delivered',
    total: '43.250 KD',
    items: 4,
    date: '2023-06-14T14:20:00Z',
  },
  {
    id: 'ORD-7894',
    customer: 'Layla Al-Azmi',
    email: 'layla@example.com',
    status: 'cancelled',
    total: '29.500 KD',
    items: 3,
    date: '2023-06-14T11:45:00Z',
  },
  {
    id: 'ORD-7895',
    customer: 'Mohammad Al-Saqer',
    email: 'mohammad@example.com',
    status: 'processing',
    total: '55.750 KD',
    items: 5,
    date: '2023-06-14T10:15:00Z',
  },
  {
    id: 'ORD-7896',
    customer: 'Sara Al-Mutawa',
    email: 'sara@example.com',
    status: 'delivered',
    total: '18.250 KD',
    items: 2,
    date: '2023-06-13T16:30:00Z',
  },
];

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // This would be replaced with actual API calls in a real implementation
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['adminOrders', statusFilter],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would fetch from your database here
      let filteredOrders = [...mockOrders];
      
      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
      }
      
      return filteredOrders;
    },
  });
  
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    // In a real app, you would update the order status in your database
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
    refetch();
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter orders based on search term
  const filteredOrders = orders?.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
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
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">Order Management</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            View and manage all your ice cream orders
          </p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>Manage customer orders and their status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => refetch()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : filteredOrders && filteredOrders.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer}</div>
                              <div className="text-sm text-muted-foreground">{order.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={getStatusBadgeColor(order.status)}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>{order.total}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'processing')}>
                                  Mark as Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}>
                                  Mark as Shipped
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}>
                                  Mark as Delivered
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}>
                                  Mark as Cancelled
                                </DropdownMenuItem>
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
                  <p className="text-muted-foreground">No orders found matching your filters.</p>
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

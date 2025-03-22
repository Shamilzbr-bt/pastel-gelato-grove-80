
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Package, 
  Users, 
  CreditCard, 
  TrendingUp,
  ShoppingBag,
  CalendarClock,
  BarChart3
} from 'lucide-react';

// Mock data for demonstration purposes
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

const ordersData = [
  { name: 'Jan', orders: 145 },
  { name: 'Feb', orders: 132 },
  { name: 'Mar', orders: 164 },
  { name: 'Apr', orders: 123 },
  { name: 'May', orders: 98 },
  { name: 'Jun', orders: 87 },
  { name: 'Jul', orders: 102 },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('week');
  
  // This would be replaced with actual API calls in a real implementation
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ['adminDashboardStats', timeRange],
    queryFn: async () => {
      // Simulate API call - in a real app, this would fetch from your API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        totalSales: 'KD 26,350.50',
        totalOrders: 847,
        totalCustomers: 423,
        avgOrderValue: 'KD 31.10',
        pendingOrders: 12,
        topSellingFlavors: [
          { name: 'Chocolate Chunk', sales: 142 },
          { name: 'Strawberry Delight', sales: 121 },
          { name: 'Vanilla Bean', sales: 98 },
          { name: 'Pistachio Dream', sales: 76 },
          { name: 'Mango Tango', sales: 69 }
        ]
      };
    },
  });
  
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
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">Dashboard</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            View your ice cream shop's performance at a glance
          </p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Overview</h2>
              <TabsList>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="year">This Year</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.totalSales}</div>
                    <p className="text-xs text-muted-foreground">
                      +18.1% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.totalOrders}</div>
                    <p className="text-xs text-muted-foreground">
                      +12.4% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.totalCustomers}</div>
                    <p className="text-xs text-muted-foreground">
                      +7.6% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats?.avgOrderValue}</div>
                    <p className="text-xs text-muted-foreground">
                      +5.2% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Your ice cream shop's sales for the last period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sales" fill="#FF85B3" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Order Trends</CardTitle>
                    <CardDescription>Total orders placed over the last period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ordersData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="orders" 
                            stroke="#9D26FF" 
                            strokeWidth={2} 
                            dot={{ r: 4 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Top Selling Flavors</CardTitle>
                    <CardDescription>Your most popular ice cream flavors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardStats?.topSellingFlavors.map((flavor, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-gelatico-pink mr-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{flavor.name}</div>
                          </div>
                          <div className="font-medium">{flavor.sales} sold</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Tasks</CardTitle>
                    <CardDescription>Items that need your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-orange-100 p-4 rounded-lg flex">
                        <Package className="h-5 w-5 text-orange-500 mr-2" />
                        <div>
                          <h4 className="font-medium">Pending Orders</h4>
                          <p className="text-sm text-muted-foreground">{dashboardStats?.pendingOrders} orders need processing</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-100 p-4 rounded-lg flex">
                        <CalendarClock className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <h4 className="font-medium">Inventory Check</h4>
                          <p className="text-sm text-muted-foreground">Weekly inventory review due</p>
                        </div>
                      </div>
                      
                      <div className="bg-purple-100 p-4 rounded-lg flex">
                        <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                        <div>
                          <h4 className="font-medium">Sales Report</h4>
                          <p className="text-sm text-muted-foreground">Monthly report ready for review</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { profileService } from '@/services/profile';
import { ordersService } from '@/services/orders';
import { checkoutService } from '@/services/checkout';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { Package, MapPin, Heart, User, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => profileService.getUserProfile(),
  });
  
  const { data: ordersData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['userOrders'],
    queryFn: () => ordersService.getUserOrders(),
    select: (data) => {
      if (data.success) {
        return {
          ...data,
          orders: data.orders.slice(0, 3)  // Get only the 3 most recent orders
        };
      }
      return data;
    }
  });
  
  const { data: addressesData, isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['userAddresses'],
    queryFn: () => checkoutService.getUserAddresses(),
  });
  
  const profile = profileData?.success ? profileData.profile : null;
  const recentOrders = ordersData?.success ? ordersData.orders : [];
  const addresses = addressesData?.success ? addressesData.addresses : [];
  
  const handleSignOut = async () => {
    await signOut();
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
            My Account
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">
            {isLoadingProfile ? 'Loading...' : `Hello, ${profile?.first_name || user?.email}`}
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your orders, addresses, and account details
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Link 
                    to="/account" 
                    className="flex items-center gap-2 p-4 hover:bg-muted transition-colors border-b"
                  >
                    <User size={18} />
                    <span>My Account</span>
                  </Link>
                  <Link 
                    to="/account/orders" 
                    className="flex items-center gap-2 p-4 hover:bg-muted transition-colors border-b"
                  >
                    <Package size={18} />
                    <span>Orders</span>
                  </Link>
                  <Link 
                    to="/account/addresses" 
                    className="flex items-center gap-2 p-4 hover:bg-muted transition-colors border-b"
                  >
                    <MapPin size={18} />
                    <span>Addresses</span>
                  </Link>
                  <Link 
                    to="/account/favorites" 
                    className="flex items-center gap-2 p-4 hover:bg-muted transition-colors border-b"
                  >
                    <Heart size={18} />
                    <span>Favorites</span>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 p-4 text-left hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Your most recent orders</CardDescription>
                    </div>
                    <Link to="/account/orders">
                      <Button variant="outline">View All</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {isLoadingOrders ? (
                      <div className="flex items-center justify-center p-6">
                        <div className="w-6 h-6 border-2 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                      </div>
                    ) : recentOrders.length === 0 ? (
                      <div className="text-center p-6">
                        <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                        <Link to="/shop">
                          <Button variant="link">Start Shopping</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recentOrders.map((order: any) => (
                          <Link 
                            key={order.id} 
                            to={`/account/orders/${order.id}`}
                            className="block"
                          >
                            <div className="flex justify-between items-center p-4 hover:bg-muted rounded-md transition-colors">
                              <div>
                                <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{order.total_amount.toFixed(3)} KD</p>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full text-white ${
                                  order.status === 'delivered' ? 'bg-green-500' :
                                  order.status === 'cancelled' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Saved Addresses */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Saved Addresses</CardTitle>
                      <CardDescription>Your delivery addresses</CardDescription>
                    </div>
                    <Link to="/account/addresses">
                      <Button variant="outline">Manage</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {isLoadingAddresses ? (
                      <div className="flex items-center justify-center p-6">
                        <div className="w-6 h-6 border-2 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                      </div>
                    ) : addresses.length === 0 ? (
                      <div className="text-center p-6">
                        <p className="text-muted-foreground">You don't have any saved addresses yet.</p>
                        <Link to="/account/addresses">
                          <Button variant="link">Add Address</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {addresses.slice(0, 2).map((item: any) => (
                          <div key={item.id} className="p-4 border rounded-md">
                            <div className="flex justify-between mb-2">
                              <p className="font-medium">
                                {item.address.first_name} {item.address.last_name}
                              </p>
                              {item.is_default && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.address.address1}
                              {item.address.address2 && `, ${item.address.address2}`}
                              <br />
                              {item.address.city}, {item.address.province} {item.address.zip}
                              <br />
                              {item.address.country}
                              {item.address.phone && <><br />{item.address.phone}</>}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingProfile ? (
                      <div className="flex items-center justify-center p-6">
                        <div className="w-6 h-6 border-2 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                      </div>
                    ) : profile ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">First Name</h3>
                            <p>{profile.first_name}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Last Name</h3>
                            <p>{profile.last_name}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                          <p>{profile.email}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                          <p>{profile.phone || 'Not provided'}</p>
                        </div>
                        
                        <div className="pt-4">
                          <Button>Edit Profile</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <p className="text-muted-foreground">There was an error loading your profile.</p>
                        <Button variant="link" onClick={() => window.location.reload()}>Try Again</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

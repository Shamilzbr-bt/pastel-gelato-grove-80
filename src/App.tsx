
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Flavors from "./pages/Flavors";
import Product from "./pages/Product";
import About from "./pages/About";
import Locations from "./pages/Locations";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import NotFound from "./pages/NotFound";
import { AnimatePresence } from "framer-motion";
import AnimatedBackground from "./components/AnimatedBackground";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/account/Dashboard";
import OrderHistory from "./pages/account/OrderHistory";
import OrderDetails from "./pages/account/OrderDetails";
import SavedAddresses from "./pages/account/SavedAddresses";
import Favorites from "./pages/account/Favorites";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminInventory from "./pages/admin/Inventory";
import AdminCustomers from "./pages/admin/Customers";
import AdminDeliveryZones from "./pages/admin/DeliveryZones";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedBackground />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/flavors" element={<Flavors />} />
              <Route path="/flavors/:id" element={<Product />} />
              <Route path="/about" element={<About />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout-success" element={<CheckoutSuccess />} />
              <Route path="/product/:id" element={<Product />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Account Routes */}
              <Route path="/account" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/account/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
              <Route path="/account/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              <Route path="/account/addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
              <Route path="/account/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/inventory" element={<AdminRoute><AdminInventory /></AdminRoute>} />
              <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
              <Route path="/admin/delivery-zones" element={<AdminRoute><AdminDeliveryZones /></AdminRoute>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

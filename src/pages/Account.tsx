
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountTabs from '@/components/account/AccountTabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function Account() {
  const { user, isLoading, signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gelatico-pink"></div>
      </div>
    );
  }
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <div>
            <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
              My Account
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-gelatico">
              Welcome, {user.user_metadata?.first_name || 'Gelatico Fan'}
            </h1>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={signOut}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-soft"
        >
          <AccountTabs />
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}

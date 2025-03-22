
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if accessed directly without an order ID
    if (!orderId) {
      navigate('/');
    }
  }, [orderId, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-green-100 text-green-600 text-sm font-medium uppercase tracking-wider">
            Order Confirmed
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-gelatico mb-6">
            Thank You!
          </h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl shadow-soft"
        >
          <div className="flex justify-center mb-6">
            <CheckCircle size={60} className="text-green-500" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-4">Your order has been received</h2>
          
          {orderId && (
            <p className="text-muted-foreground mb-6">
              Order ID: <span className="font-medium text-black">{orderId}</span>
            </p>
          )}
          
          <p className="text-muted-foreground mb-8">
            We are preparing your order and will contact you soon with the delivery details.
            A confirmation email will be sent shortly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/shop')}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Continue Shopping
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}

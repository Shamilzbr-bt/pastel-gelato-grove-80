
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { checkoutService, CheckoutOptions, PaymentDetails } from '@/services/checkout';
import { toast } from 'sonner';

// Form schema for billing info
const billingSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  address1: z.string().min(5, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  country: z.string().min(2, 'Country is required'),
  zip: z.string().min(3, 'Postal/ZIP code is required'),
  phone: z.string().min(8, 'Phone number is required'),
  save_address: z.boolean().optional(),
  delivery_date: z.string().min(1, 'Please select a delivery date'),
  delivery_time: z.string().min(1, 'Please select a delivery time'),
  special_instructions: z.string().optional(),
});

// Form schema for payment
const paymentSchema = z.object({
  payment_method: z.string().min(1, 'Please select a payment method'),
  card_number: z.string().optional(),
  expiry_date: z.string().optional(),
  cvv: z.string().optional(),
  cardholder_name: z.string().optional(),
});

type BillingFormValues = z.infer<typeof billingSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function Checkout() {
  const { cartItems, calculateSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState('billing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingData, setBillingData] = useState<BillingFormValues | null>(null);
  
  // Get user's saved addresses
  const { data: addressesData } = useQuery({
    queryKey: ['userAddresses'],
    queryFn: () => checkoutService.getUserAddresses(),
    enabled: !!user
  });
  
  const savedAddresses = addressesData?.success ? addressesData.addresses : [];
  
  // Get available delivery time slots
  const { data: timeSlotsData } = useQuery({
    queryKey: ['deliveryTimeSlots'],
    queryFn: () => checkoutService.getDeliveryTimeSlots()
  });
  
  const dates = timeSlotsData?.dates || [];
  const timeSlots = timeSlotsData?.timeSlots || [];
  
  const subtotal = calculateSubtotal();
  const shippingFee = subtotal >= 15 ? 0 : 2;
  const total = subtotal + shippingFee;
  
  // Initialize form for billing information
  const billingForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      email: user?.email || '',
      first_name: '',
      last_name: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      country: 'Kuwait',
      zip: '',
      phone: '',
      save_address: true,
      delivery_date: '',
      delivery_time: '',
      special_instructions: '',
    }
  });
  
  // Initialize form for payment information
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: 'card',
      card_number: '',
      expiry_date: '',
      cvv: '',
      cardholder_name: '',
    }
  });
  
  // Handle billing form submission
  const onBillingSubmit = async (values: BillingFormValues) => {
    // Check if the address is within delivery radius
    const addressValidation = await checkoutService.validateDeliveryAddress({
      city: values.city,
      province: values.province,
      country: values.country,
    });
    
    if (!addressValidation.valid) {
      toast.error(addressValidation.message || 'We do not deliver to your location');
      return;
    }
    
    setBillingData(values);
    setStep('payment');
  };
  
  // Handle payment form submission
  const onPaymentSubmit = async (values: PaymentFormValues) => {
    if (!billingData) {
      setStep('billing');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Format the checkout data
      const checkoutOptions: CheckoutOptions = {
        email: billingData.email,
        address: {
          first_name: billingData.first_name,
          last_name: billingData.last_name,
          address1: billingData.address1,
          address2: billingData.address2,
          city: billingData.city,
          province: billingData.province,
          country: billingData.country,
          zip: billingData.zip,
          phone: billingData.phone,
          is_default: billingData.save_address,
        },
        delivery_time: {
          date: billingData.delivery_date,
          time_slot: billingData.delivery_time,
        },
        special_instructions: billingData.special_instructions,
      };
      
      const paymentDetails: PaymentDetails = {
        payment_method: values.payment_method,
        card_number: values.card_number,
        expiry_date: values.expiry_date,
        cvv: values.cvv,
        cardholder_name: values.cardholder_name,
      };
      
      // Process the checkout
      const result = await checkoutService.processCheckout(
        cartItems, 
        checkoutOptions,
        paymentDetails
      );
      
      if (result.success) {
        // Clear the cart
        clearCart();
        
        // Redirect to success page
        navigate(`/checkout-success?orderId=${result.orderId}`);
      } else {
        toast.error(result.error || 'There was a problem processing your order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was a problem processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Load a saved address
  const loadSavedAddress = (addressId: string) => {
    const selectedAddress = savedAddresses.find((address: any) => address.id === addressId);
    
    if (selectedAddress) {
      const { address } = selectedAddress;
      
      billingForm.reset({
        ...billingForm.getValues(),
        first_name: address.first_name,
        last_name: address.last_name,
        address1: address.address1,
        address2: address.address2 || '',
        city: address.city,
        province: address.province,
        country: address.country,
        zip: address.zip,
        phone: address.phone,
      });
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
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            Checkout
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-6">
            Complete Your Order
          </h1>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={step} onValueChange={setStep}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="billing">Delivery Information</TabsTrigger>
                <TabsTrigger value="payment" disabled={!billingData}>Payment</TabsTrigger>
              </TabsList>
              
              {/* Billing & Shipping Tab */}
              <TabsContent value="billing">
                <Card>
                  <CardContent className="pt-6">
                    <Form {...billingForm}>
                      <form onSubmit={billingForm.handleSubmit(onBillingSubmit)} className="space-y-6">
                        {/* Saved Addresses */}
                        {savedAddresses.length > 0 && (
                          <div className="space-y-2">
                            <FormLabel>Saved Addresses</FormLabel>
                            <Select onValueChange={loadSavedAddress}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a saved address" />
                              </SelectTrigger>
                              <SelectContent>
                                {savedAddresses.map((address: any) => (
                                  <SelectItem key={address.id} value={address.id}>
                                    {address.address.first_name} {address.address.last_name} - 
                                    {address.address.city}, {address.address.province}
                                    {address.is_default ? ' (Default)' : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        
                        {/* Contact Information */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                          <FormField
                            control={billingForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Separator />
                        
                        {/* Shipping Information */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Delivery Address</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={billingForm.control}
                              name="first_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={billingForm.control}
                              name="last_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={billingForm.control}
                            name="address1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address Line 1</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={billingForm.control}
                            name="address2"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address Line 2 (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Apt 4B" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={billingForm.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Kuwait City" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={billingForm.control}
                              name="province"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Province</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Al Asimah" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={billingForm.control}
                              name="country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <FormControl>
                                    <Input disabled {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={billingForm.control}
                              name="zip"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Postal / ZIP Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="12345" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={billingForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+965 123 4567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {user && (
                            <div className="flex items-center space-x-2 mt-4">
                              <input
                                type="checkbox"
                                id="save_address"
                                className="rounded border-gray-300 text-gelatico-pink"
                                {...billingForm.register('save_address')}
                              />
                              <label htmlFor="save_address" className="text-sm text-muted-foreground">
                                Save this address for future orders
                              </label>
                            </div>
                          )}
                        </div>
                        
                        <Separator />
                        
                        {/* Delivery Information */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={billingForm.control}
                              name="delivery_date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Delivery Date</FormLabel>
                                  <FormControl>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select date" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {dates.map((date) => (
                                          <SelectItem key={date} value={date}>
                                            {new Date(date).toLocaleDateString('en-US', {
                                              weekday: 'short',
                                              month: 'short',
                                              day: 'numeric'
                                            })}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={billingForm.control}
                              name="delivery_time"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Delivery Time</FormLabel>
                                  <FormControl>
                                    <Select 
                                      onValueChange={field.onChange} 
                                      defaultValue={field.value}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {timeSlots.map((slot) => (
                                          <SelectItem key={slot} value={slot}>
                                            {slot}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={billingForm.control}
                            name="special_instructions"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Special Instructions (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Special delivery instructions, dietary requirements, etc." 
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit" className="w-full">
                          Continue to Payment
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Payment Tab */}
              <TabsContent value="payment">
                <Card>
                  <CardContent className="pt-6">
                    <Form {...paymentForm}>
                      <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                        <FormField
                          control={paymentForm.control}
                          name="payment_method"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Payment Method</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted cursor-pointer">
                                    <RadioGroupItem value="card" id="payment-card" />
                                    <label htmlFor="payment-card" className="flex-1 cursor-pointer">
                                      <div className="font-medium">Credit/Debit Card</div>
                                      <div className="text-sm text-muted-foreground">Pay securely with your card</div>
                                    </label>
                                    <div className="flex space-x-1">
                                      {/* Card logos would go here */}
                                      <div className="w-10 h-6 bg-blue-600 rounded"></div>
                                      <div className="w-10 h-6 bg-red-500 rounded"></div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 border p-4 rounded-md hover:bg-muted cursor-pointer">
                                    <RadioGroupItem value="cod" id="payment-cod" />
                                    <label htmlFor="payment-cod" className="flex-1 cursor-pointer">
                                      <div className="font-medium">Cash on Delivery</div>
                                      <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {paymentForm.watch('payment_method') === 'card' && (
                          <>
                            <FormField
                              control={paymentForm.control}
                              name="card_number"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Card Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="1234 5678 9012 3456" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={paymentForm.control}
                                name="expiry_date"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="MM/YY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={paymentForm.control}
                                name="cvv"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                      <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={paymentForm.control}
                              name="cardholder_name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cardholder Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </>
                        )}
                        
                        <div className="pt-4 space-y-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setStep('billing')}
                          >
                            Back to Delivery Information
                          </Button>
                          
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </span>
                            ) : `Place Order • ${total.toFixed(3)} KD`}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.variantId} className="flex justify-between">
                      <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                          {item.quantity}
                        </div>
                        <span className="text-sm">{item.title}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {(parseFloat(item.price || "0") * item.quantity).toFixed(3)} KD
                      </span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{subtotal.toFixed(3)} KD</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shippingFee === 0 
                        ? <span className="text-green-600">Free</span> 
                        : `${shippingFee.toFixed(3)} KD`
                      }
                    </span>
                  </div>
                  
                  {shippingFee > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Free shipping on orders over 15 KD
                    </div>
                  )}
                  
                  <div className="border-t border-muted pt-4 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{total.toFixed(3)} KD</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

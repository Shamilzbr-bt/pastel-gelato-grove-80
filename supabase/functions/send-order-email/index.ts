
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Order email notification function received request');
    
    const { orderId, email, orderData } = await req.json();
    
    if (!orderId || !email || !orderData) {
      throw new Error('Missing required parameters');
    }
    
    console.log(`Sending order confirmation for order: ${orderId} to: ${email}`);
    
    // In a production environment, this would use a real email service
    // For this example, we'll just simulate sending an email and return success
    
    // Format order items for the email
    const items = orderData.items.map((item: any) => 
      `${item.title} (${item.quantity}) - ${item.total} KD`
    ).join('\n');
    
    // Email template that would be sent
    const emailContent = `
      Order Confirmation - ${orderId}
      
      Thank you for your order!
      
      Order Details:
      ${items}
      
      Total: ${orderData.total_amount.toFixed(3)} KD
      
      Delivery Details:
      ${orderData.delivery_address.first_name} ${orderData.delivery_address.last_name}
      ${orderData.delivery_address.address1}
      ${orderData.delivery_address.city}, ${orderData.delivery_address.province}
      ${orderData.delivery_address.country}
      
      Delivery Time: ${orderData.delivery_time.date} between ${orderData.delivery_time.time_slot}
      
      If you have any questions, please don't hesitate to contact us.
      
      Gelatico Team
    `;
    
    console.log('Email would contain:', emailContent);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order confirmation email sent successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error sending order email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

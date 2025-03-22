
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOPIFY_API_KEY = Deno.env.get('SHOPIFY_API_KEY');
const SHOPIFY_API_SECRET = Deno.env.get('SHOPIFY_API_SECRET');
const SHOPIFY_STORE_URL = Deno.env.get('SHOPIFY_STORE_URL');

if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET || !SHOPIFY_STORE_URL) {
  console.error('Missing required Shopify environment variables');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Edge function received request');
    
    const { action, data } = await req.json();
    console.log(`Processing action: ${action}`);
    
    // Debug environment variables (without exposing sensitive data)
    console.log(`SHOPIFY_STORE_URL is set: ${!!SHOPIFY_STORE_URL}`);
    console.log(`SHOPIFY_API_KEY is set: ${!!SHOPIFY_API_KEY}`);
    console.log(`SHOPIFY_API_SECRET is set: ${!!SHOPIFY_API_SECRET}`);

    // Check if required environment variables are present
    if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET || !SHOPIFY_STORE_URL) {
      console.error('Missing required Shopify credentials for action:', action);
      return new Response(
        JSON.stringify({ error: 'Shopify API credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Base headers for all Shopify API requests
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_SECRET,
    };

    console.log('Using headers:', { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': '[REDACTED]' });

    let result;
    const baseUrl = `https://${SHOPIFY_STORE_URL}/admin/api/2023-10`;

    // Route the request based on the action
    switch (action) {
      case 'getProducts':
        console.log('Fetching products from Shopify');
        const productsUrl = `${baseUrl}/products.json`;
        console.log(`Making request to: ${productsUrl}`);
        
        const productsResponse = await fetch(productsUrl, {
          method: 'GET',
          headers,
        });
        
        if (!productsResponse.ok) {
          const errorData = await productsResponse.text();
          console.error('Shopify products error:', errorData);
          throw new Error(`Failed to fetch products: ${productsResponse.status}`);
        }
        
        result = await productsResponse.json();
        console.log(`Successfully fetched ${result.products?.length || 0} products`);
        break;

      case 'getProduct':
        const { productId } = data;
        console.log(`Fetching product with ID: ${productId}`);
        const productUrl = `${baseUrl}/products/${productId}.json`;
        console.log(`Making request to: ${productUrl}`);
        
        const productResponse = await fetch(productUrl, {
          method: 'GET',
          headers,
        });
        
        if (!productResponse.ok) {
          const errorData = await productResponse.text();
          console.error('Shopify product error:', errorData);
          throw new Error(`Failed to fetch product: ${productResponse.status}`);
        }
        
        result = await productResponse.json();
        console.log('Successfully fetched product:', result.product?.title);
        break;

      case 'createCheckout':
        // For testing/development - send success response to verify frontend flow
        if (Deno.env.get('SHOPIFY_DEV_MODE') === 'true') {
          console.log('DEV MODE: Returning mock checkout response');
          return new Response(
            JSON.stringify({
              checkout: { token: 'mock-token' },
              checkout_url: `https://${SHOPIFY_STORE_URL}/checkout/mock-token`
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const { items, email, address } = data;
        console.log('Creating checkout with items:', JSON.stringify(items));
        
        if (!items || items.length === 0) {
          console.error('No items provided for checkout');
          return new Response(
            JSON.stringify({ error: 'No items provided for checkout' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        // Format line items correctly for Shopify API
        const lineItems = items.map(item => {
          // Check if the variant ID looks like a Shopify ID (typically a large number)
          // If not, it might be our custom ID format which won't work with Shopify
          const variantId = item.variantId;
          console.log(`Processing line item with variantId: ${variantId}`);
          
          return {
            variant_id: variantId,
            quantity: item.quantity
          };
        });
        
        console.log('Formatted line items:', JSON.stringify(lineItems));
        
        // Create a checkout request with correctly formatted data
        const checkoutUrl = `${baseUrl}/checkouts.json`;
        console.log(`Making request to: ${checkoutUrl}`);
        
        const checkoutPayload = {
          checkout: {
            line_items: lineItems,
            email: email || '',
            shipping_address: address || {}
          }
        };
        
        console.log('Checkout payload:', JSON.stringify(checkoutPayload));
        
        try {
          const checkoutResponse = await fetch(checkoutUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(checkoutPayload)
          });
          
          // Get response status and handle errors
          const status = checkoutResponse.status;
          console.log(`Checkout response status: ${status}`);
          
          // Get the full response text for debugging
          const responseText = await checkoutResponse.text();
          console.log('Raw response:', responseText);
          
          if (!checkoutResponse.ok) {
            console.error('Shopify checkout error:', responseText);
            return new Response(
              JSON.stringify({ 
                error: `Failed to create checkout: ${status}`,
                details: responseText
              }),
              { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Parse the JSON response if possible
          let checkoutData;
          try {
            checkoutData = JSON.parse(responseText);
            console.log('Checkout created successfully:', JSON.stringify(checkoutData));
          } catch (e) {
            console.error('Error parsing checkout response JSON:', e);
            return new Response(
              JSON.stringify({ 
                error: 'Invalid response from Shopify',
                details: responseText
              }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          // Generate the checkout web URL
          if (checkoutData.checkout && checkoutData.checkout.token) {
            checkoutData.checkout_url = `https://${SHOPIFY_STORE_URL}/checkout/${checkoutData.checkout.token}`;
            console.log('Checkout URL created:', checkoutData.checkout_url);
          } else {
            console.error('Checkout token not found in response');
          }
          
          result = checkoutData;
        } catch (fetchError) {
          console.error('Network error during checkout creation:', fetchError);
          return new Response(
            JSON.stringify({ 
              error: 'Network error during checkout creation',
              details: fetchError.message
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        break;

      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

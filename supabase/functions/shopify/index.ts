
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
    const { action, data } = await req.json();

    // Base headers for all Shopify API requests
    const headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_SECRET,
    };

    let result;
    const baseUrl = `https://${SHOPIFY_STORE_URL}/admin/api/2023-10`;

    // Route the request based on the action
    switch (action) {
      case 'getProducts':
        console.log('Fetching products from Shopify');
        const productsResponse = await fetch(`${baseUrl}/products.json`, {
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
        const productResponse = await fetch(`${baseUrl}/products/${productId}.json`, {
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
        const { items, email, address } = data;
        console.log('Creating checkout with items:', items);
        
        // Create a checkout instead of a draft order for better user experience
        const checkoutResponse = await fetch(`${baseUrl}/checkouts.json`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            checkout: {
              line_items: items.map(item => ({
                variant_id: item.variantId,
                quantity: item.quantity
              })),
              email: email || '',
              shipping_address: address || {}
            }
          })
        });
        
        if (!checkoutResponse.ok) {
          const errorData = await checkoutResponse.text();
          console.error('Shopify checkout error:', errorData);
          throw new Error(`Failed to create checkout: ${checkoutResponse.status}`);
        }
        
        // Get the checkout data
        const checkoutData = await checkoutResponse.json();
        
        // Generate the checkout web URL
        if (checkoutData.checkout && checkoutData.checkout.token) {
          checkoutData.checkout_url = `https://${SHOPIFY_STORE_URL}/checkout/${checkoutData.checkout.token}`;
          console.log('Checkout URL created:', checkoutData.checkout_url);
        }
        
        result = checkoutData;
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

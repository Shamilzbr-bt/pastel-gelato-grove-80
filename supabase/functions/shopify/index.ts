
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
        const productsResponse = await fetch(`${baseUrl}/products.json`, {
          method: 'GET',
          headers,
        });
        result = await productsResponse.json();
        break;

      case 'getProduct':
        const { productId } = data;
        const productResponse = await fetch(`${baseUrl}/products/${productId}.json`, {
          method: 'GET',
          headers,
        });
        result = await productResponse.json();
        break;

      case 'createCheckout':
        const { items } = data;
        // Create a draft order that will serve as our "checkout"
        const checkoutResponse = await fetch(`${baseUrl}/draft_orders.json`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            draft_order: {
              line_items: items.map(item => ({
                variant_id: item.variantId,
                quantity: item.quantity
              }))
            }
          })
        });
        result = await checkoutResponse.json();
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

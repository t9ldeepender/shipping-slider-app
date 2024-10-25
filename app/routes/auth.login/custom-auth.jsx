import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const shop = new URL(request.url).searchParams.get("shop");

  if (!shop) {
    throw new Response("Shop parameter is missing", { status: 400 });
  }

  const apiKey = process.env.SHOPIFY_API_KEY;
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI;
  const scopes = "read_products,write_products"; // Adjust scopes as needed

  const installUrl = `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;

  // Redirect to Shopify's app authorization page
  return redirect(installUrl);
};


// https://shipping-delivery-22.myshopify.com.myshopify.com/admin/oauth/authorize?client_id=a1b9e8f715d15af647352dacf062b748&scope=read_cart_transforms&redirect_uri=https://shipping-delivery-22.myshopify.com/auth/callback
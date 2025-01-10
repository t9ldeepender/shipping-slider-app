import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const shop = new URL(request.url).searchParams.get("shop");

  if (!shop) {
    throw new Response("Shop parameter is missing", { status: 400 });
  }

  const apiKey = process.env.SHOPIFY_API_KEY;
  const redirectUri = process.env.SHOPIFY_REDIRECT_URI;
  const scopes = "read_products,write_themes";

  const installUrl = `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;

  // Redirect to Shopify's app authorization page
  return redirect(installUrl);

};

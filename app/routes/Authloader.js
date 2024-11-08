import { json, redirect } from "@remix-run/node";
import config from "../../config"
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {

  const session = await authenticate.admin(request);
  const authToken = session.session.accessToken;

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  // Redirect if token is missing
  if (!authToken) {
    const client_id = process.env.SHOPIFY_API_KEY;
    const redirect_uri = `${config.redirectUrl}/auth/callback`;
    const scope = "read_products";
    const randomState = generateRandomString();

    const auth_url = `https://${shop}/admin/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${randomState}`;
    
    return redirect(auth_url);
  }

  return json({ token : authToken });
};

// Helper function to generate a random state string (for CSRF protection)
function generateRandomString() {
  return Math.random().toString(36).substring(7);
}

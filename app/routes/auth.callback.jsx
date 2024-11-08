import { redirect } from "@remix-run/node";
import { getSession } from "../utils/session";
import config from "../../config"
import { authenticate } from "../shopify.server";

// Loader function for handling Shopify OAuth callback
export const loader = async ({ request }) => {
  const session = await getSession(request);

  const url = new URL(request.url);
  console.log("Loader hit - request URL:", request.url);

  // get request object for seeing, if it contains the accessToken
  const tokenFromSession = await authenticate.admin(request);
  const authToken = tokenFromSession.session?.accessToken;

  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");

  // Check if the shop and code are present
  if (!shop || !code) {
    console.error("Shop or code is missing. Redirecting to OAuth.");
    
    const client_id = process.env.SHOPIFY_API_KEY;
    const redirect_uri = `${config.redirectUrl}/auth/callback`; // Correct callback URL
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${client_id}&scope=read_themes&redirect_uri=${redirect_uri}`;

    // Redirect the user to Shopify's OAuth page
    return redirect(authUrl);
  }

  // Log the received code
  console.log("Code received:", code);

  // Exchange the authorization code for an access token
  const accessToken = await exchangeCodeForAccessToken(shop, code, authToken);

  if (!accessToken) {
    console.error("Token exchange failed.");
    return new Response("Token exchange failed.", { status: 500 });
  }

  // Log the access token
  console.log("Access token received:", accessToken);

  session.set("accessToken", accessToken);
  // Store the access token or pass it to your app in some way
  // Redirect to your app's page inside the Shopify admin
  const appUrl = `https://${shop}/admin/apps/shipping-delivery-2/app`;

  return redirect(appUrl);
};

// Function to exchange the authorization code for an access token
async function exchangeCodeForAccessToken(shop, code, authToken) {
  const client_id = process.env.SHOPIFY_API_KEY;
  const client_secret = process.env.SHOPIFY_API_SECRET;

  //see if token already in session or not
  if(authToken){
    return authToken
  }else{
    // Make a request to exchange the authorization code for an access token
    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });
    const data = await response.json();
  
    // Check if the token exchange was successful
    if (!response.ok) {
      console.error("Error exchanging code for token:", data);
      return null;
    }
  
    // Return the access token
    return data.access_token;
  }


}



import { useEffect, useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { Page, Layout, Text, Card, Button, BlockStack, Box, List, Link, InlineStack } from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { getSession } from "../utils/session";
import { Redirect } from "@shopify/app-bridge/actions";
import { ErrorComponent } from "./components/error";
import { GridExample } from "./components/grid-box";


// Loader function for handling authentication and retrieving the access token
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const token = url.searchParams.get("token");

  // If no access token is found, redirect to the OAuth flow
  if (!token) {
    const client_id = process.env.SHOPIFY_API_KEY;
    const redirect_uri = "https://matters-massachusetts-weekends-castle.trycloudflare.com/auth/callback";
    const scope = "read_products";

    const randomState = generateRandomString();
    const auth_url = `https://${shop}/admin/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${randomState}`;

    console.log("Redirecting to Shopify OAuth:", auth_url);
    return redirect(auth_url);
  }

  console.log("Access token found:", token);

  return json({ token });
};

// Helper function to generate a random state string (for CSRF protection)
function generateRandomString() {
  return Math.random().toString(36).substring(7);  // Basic random string generator
}

// Main component that handles the client-side logic and App Bridge setup
export default function Index() {

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const app = useAppBridge(); // Initialize App Bridge instance
  const {token} = useLoaderData();
  console.log("loaderData ---t",token)

  useEffect(() => {
    // If token exists in the loader data, save it to local storage and state
    if (token) {
      localStorage.setItem("auth_token", token);
    }
  }, []);


  const GotoSettings = () => {
    navigate("/settings")
    console.log("clicked")
  }

 
  return (
    <>
      {token ?
        <div>
          <GridExample heading="Go To Settings" content="Let set your app settings" button={true} route="/settings"/>
        </div>
      :
        <div>
         <ErrorComponent errMessage={"No Data as you don't have token yet"}/>
        </div>  
      }
    </>
  );
}

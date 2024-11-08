import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { useEffect, useState } from "react";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  // Retrieve apiKey and host from environment or URL
  const apiKey = process.env.SHOPIFY_API_KEY || "";
  const host = new URL(request.url).searchParams.get("host");

  return json({ apiKey, host });
};

export default function App() {
  const { apiKey, host } = useLoaderData();
  // state to store the auth_token


  // why to set the token? as without it our code will not work, so in production I will store it in db and for now it would be the best option

  return (
    <AppProvider isEmbeddedApp={true} apiKey={apiKey} host={host}>
      <NavMenu>
        <Link to={`/app`} rel="home">Home</Link>
        <Link to={`/app/settings`} rel="settings">Settings</Link>
        <Link to={`/app/pricing`} rel="pricing">Pricing</Link>
        <Link to={`/app/store`} rel="store-data">Store Data</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};

import { json, redirect } from "@remix-run/node"; 
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { getCode } from "./app._index";

export function IframeHandler({ shop, host }) {
  const navigate = useNavigate();

  useEffect(() => {

    if (window.self !== window.top) {
      const exitIframeUrl = `/auth/exit-iframe?shop=${shop}&host=${host}`;
      window.top.location.href = exitIframeUrl;
    }
  }, [shop, host]);

  return null;
}


async function getShopifyAccessToken() {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("Missing Shopify access token");
  }
  return accessToken;
}


export const loader = async ({ request }) => {

  // try {
  //   const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       client_id: process.env.SHOPIFY_API_KEY,
  //       client_secret: process.env.SHOPIFY_API_SECRET,
  //       code,
  //     }),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`Error exchanging code: ${response.statusText}`);
  //   }

  //   const data = await response.json();
  //   const accessToken = data.access_token;

  //   console.log("Access Token:", accessToken);


  //   return json({ accessToken, shop });
  // } catch (error) {
  //   console.error("Token exchange failed:", error);
  //   return json({ error: "Failed to exchange token" }, { status: 500 });
  // }

};


export const action = async ({ request }) => {

  const body = await request.json();

  console.log("Cart updated:", body);

  return json({ success: true });
};

export function CartData() {
  const cart = useLoaderData();

  if (!cart) {
    return <div>No cart found</div>;
  }

  return (
    <div>
      <h1>Cart Information</h1>
      {getCode}
      {/* <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            Product: {item.product_title} <br />
            Quantity: {item.quantity}
          </li>
        ))}
      </ul> */}
    </div>
  );
}

import { json } from "@remix-run/node"; // or "@remix-run/cloudflare" if using Cloudflare
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const shop = "shipping-delivery-22.myshopify.com";
  const accessToken = "19b552a4-97d5-4cc3-89e5-1b608e775a47";

  try {
    const response = await fetch(`https://${shop}/admin/api/2023-07/carts.json`, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // capture the error response
      console.error(`Failed to fetch data. Status: ${response.status}. Message: ${errorMessage}`);
      throw new Response("Failed to fetch store data", { status: 500 });
    }

    const storeData = await response.json();
    console.log("Store Data:", storeData); // Log the retrieved data for debugging

    return json(storeData);
  } catch (error) {
    console.error("Error fetching data:", error); // Log the error details
    throw new Response("Failed to fetch store data", { status: 500 });
  }
};


export default function StoreData() {
  const storeData = useLoaderData();

  return (
    <div>
      <h1>Store Information</h1>
      <p>Store Name: {storeData?.shop?.name}</p>
      <p>Store Email: {storeData?.shop?.email}</p>
    </div>
  );
}
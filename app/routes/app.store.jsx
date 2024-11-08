import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react";
import { authenticate } from "../shopify.server";

// Loader to fetch all themes
export const loader = async ({ request }) => {
  const session = await authenticate.admin(request);

  if (!session || !session.session) {
    throw new Error("Shop session not established.");
  }

  const storeUrl = session.session.shop;
  const authToken = session.session.accessToken;

  console.log(`store url - ${storeUrl}, authToken - ${authToken} `)

  if (!authToken) {
    throw new Error("Access token is missing.");
  }

  // Fetch themes using the stored session shop and token
  const response = await fetch(
    `https://${storeUrl}/admin/api/2023-01/themes.json`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": authToken,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Shopify API Error:", errorResponse);
        throw new Error(`Failed to fetch themes: ${errorResponse.errors || "Unknown error"}`);
      }
  }

  const data = await response.json();
  const themes = data.themes;

  // Find the theme with role: "main" (live theme)
  const liveTheme = themes.find((theme) => theme.role === "main");

  return json({
    liveThemeId: liveTheme ? liveTheme.id : null,
    themes, // Optional: return all themes if needed
  });
};

export default function Themes() {
  const { liveThemeId, themes } = useLoaderData();

  useEffect(() => {
    const SHOPIFY_ACCESS_TOKEN = localStorage.getItem("auth_token");
    console.log(`SHOPIFY_STORE: ${liveThemeId}, SHOPIFY_ACCESS_TOKEN: ${SHOPIFY_ACCESS_TOKEN}`);
  }, [liveThemeId]);

  return (
    <div>
      <h1>Live Theme ID: {liveThemeId}</h1>
      <h2>All Themes</h2>
      <ul>
        {themes.map((theme) => (
          <li key={theme.id}>
            {theme.name} - ID: {theme.id} (Role: {theme.role})
          </li>
        ))}
      </ul>
    </div>
  );
}

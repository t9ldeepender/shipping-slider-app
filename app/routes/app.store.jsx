import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import { Frame, Toast } from "@shopify/polaris";

// Loader to fetch all themes
export const loader = async ({ request }) => {
  const session = await authenticate.admin(request);

  if (!session || !session.session) {
    throw new Error("Shop session not established.");
  }

  const storeUrl = session.session.shop;
  const authToken = session.session.accessToken;

  const response = await fetch(
    `https://${storeUrl}/admin/api/2024-07/themes.json`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": authToken,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(`Failed to fetch themes: ${errorResponse.errors || "Unknown error"}`);
  }

  const data = await response.json();
  const themes = data.themes;
  const liveTheme = themes.find((theme) => theme.role === "main");

  return json({
    liveThemeId: liveTheme ? liveTheme.id : null,
    themes,
    storeUrl,
    authToken,
  });
};

// Action to insert HTML into the theme
export const action = async ({ request }) => {
  const formData = await request.formData();
  const themeId = formData.get("themeId");
  const storeUrl = formData.get("storeUrl");
  const authToken = formData.get("authToken");

  const assetKey = "layout/theme.liquid";  // Ensure asset key is correct
  console.log("Starting fetch for theme.liquid");
  
    // Step 1: Fetch existing theme.liquid content
    let response = await fetch(
      `https://${storeUrl}/admin/api/2023-10/themes/${themeId}/assets.json?asset[key]=${assetKey}`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": authToken,
          "Content-Type": "application/json",
        },
      }
    );
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching theme.liquid:", errorData);
      throw new Error("Failed to fetch theme.liquid");
    }
    
    const assetData = await response.json();
    const existingContent = assetData.asset?.value || "";
    if (!existingContent) {
      throw new Error("Failed to retrieve existing theme.liquid content.");
    }
    console.log("Theme content fetched successfully");
    
    // Append custom HTML to theme.liquid content
    try {
      // Small, simple update to test permissions and endpoint
      const testContent = "<p>Test update</p>";
      const updatedContent = `${existingContent}\n${testContent}`;
    
      response = await fetch(`https://${storeUrl}/admin/api/2023-01/themes/${themeId}/assets.json`, {
        method: "PUT",
        headers: {
          "X-Shopify-Access-Token": authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset: {
            key: assetKey,
            value: updatedContent,
          },
        }),
      });
    
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating theme.liquid:", errorData);
        throw new Error("Failed to update theme.liquid");
      }
    
      console.log("Custom HTML content successfully added to theme.liquid");
    } catch (error) {
      console.error("Detailed error during theme modification:", error);
      if (error instanceof TypeError) {
        console.error("This may indicate a network or URL issue.");
      }
      throw new Error("Error while updating theme.liquid");
    }
    
  

  return json({ success: true });
};



export default function Themes() {
  const { liveThemeId, themes, storeUrl, authToken } = useLoaderData();
  const fetcher = useFetcher();
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (fetcher.data?.success) {
      setToast(true);
    }
  }, [fetcher.data]);

  const inserHtmlButton = () => {
    fetcher.submit(
      { themeId: liveThemeId, storeUrl, authToken },
      { method: "POST" }
    );
  };

  return (
    <Frame>
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
      <button className="insertHtmlButton" onClick={inserHtmlButton}>
        Insert in the live theme
      </button>

      {toast && (
        <Toast
          content="Content successfully added to live theme!"
          onDismiss={() => setToast(false)}
        />
      )}
    </div>
    </Frame>
  );
}

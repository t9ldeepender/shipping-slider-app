import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-07";

import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",

  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  
  // Add webhooks for carts
  webhooks: {
    CARTS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/carts/create",
      callback: async (topic, shop, body, webhookId) => {
        console.log('--- Cart Created ---');
        const payload = JSON.parse(body);
        console.log(payload);
        console.log('--- /Cart Created ---');
        // You can handle cart creation logic here (e.g., store it, notify, etc.)
      },
    },
    CARTS_UPDATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/carts/update",
      callback: async (topic, shop, body, webhookId) => {
        console.log('--- Cart Updated ---');
        const payload = JSON.parse(body);
        console.log(payload);
        console.log('--- /Cart Updated ---');
        // Handle cart update logic here (e.g., notify app, fetch latest cart data)
      },
    },
  },
  
  hooks: {
    afterAuth: async ({ session }) => {
      // Register both cart webhooks after authentication
      await shopify.registerWebhooks({ session });
      console.log("Auth happened, webhooks registered.");
    },
  },

  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;

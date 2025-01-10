import { json } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../shopify.server";

const prisma = new PrismaClient();

export async function loader({request}) {
  const session = await authenticate.admin(request);
  let shop = session.session.shop;

  try {
    const settings = await prisma.settings.findFirst({
      where: { shop }, // Match the shop field in the database
    });

    if (!settings) {
      return json({ error: "No settings found for this shop" }, { status: 404 });
    }
    
    return json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return json({ error: "Failed to fetch settings" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

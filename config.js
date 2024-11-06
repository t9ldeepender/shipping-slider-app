// config.js
import fs from "fs";
import path from "path";
import toml from "toml";

function getConfig() {
  const tomlFilePath = path.resolve("shopify.app.toml");

  try {
    // Check if the file exists
    if (!fs.existsSync(tomlFilePath)) {
      console.error("Error: shopify.app.toml file not found at", tomlFilePath);
      return null;
    }

    // Read and log file content
    const fileContent = fs.readFileSync(tomlFilePath, "utf-8");

    // Parse the file
    const config = toml.parse(fileContent);
    // console.log("Parsed config 4:", config.auth.redirect_urls); // Log parsed output for clarity

    // Return the api_key and redirect_urls
    return {
      redirectUrl: config.application_url
    };
  } catch (error) {
    console.error("Error reading or parsing shopify.app.toml 2:", error);
    return null;
  }
}

export default getConfig();

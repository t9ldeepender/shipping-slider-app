import { RemixBrowser } from "@remix-run/react";
import { hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./app/routes/custom.css"

hydrateRoot(
  document,
  <StrictMode>
    <RemixBrowser />
  </StrictMode>
);
console.log("Client-side entry loaded")
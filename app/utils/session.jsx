import { createCookieSessionStorage } from "@remix-run/node";

// Set up session storage with a secret key
const sessionSecret = process.env.SESSION_SECRET || "my-secret-key";

export const storage = createCookieSessionStorage({
  cookie: {
    name: "__session", // The name of the cookie that will store the session ID
    secure: process.env.NODE_ENV === "production", // Ensure cookie is sent over HTTPS in production
    secrets: [sessionSecret], // Secret(s) used to sign the cookie
    sameSite: "lax", // Helps prevent CSRF attacks
    path: "/", // Cookie is valid across the whole site
    httpOnly: true, // Cookie is inaccessible via JavaScript in the browser (security measure)
  },
});

// Helper function to get the session from the request
export async function getSession(request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// Helper function to commit the session (set the cookie header)
export async function commitSession(session) {
  return storage.commitSession(session);
}

// Helper function to destroy the session (clear the session cookie)
export async function destroySession(session) {
  return storage.destroySession(session);
}

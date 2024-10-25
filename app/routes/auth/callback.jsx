// import { redirect } from "remix";

// export const loader = async ({ request }) => {
//   const url = new URL(request.url);
//   console.log("Loader hit - request URL:", request.url);

//   const shop = url.searchParams.get("shop");
//   const code = url.searchParams.get("code");

//   if (!code) {
//     console.log("Missing code, redirect failed.");
//     return new Response("Missing authorization code.", { status: 400 });
//   }

//   // Handle the exchange process here
//   console.log("Code received $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", code);
//   // Proceed with token exchange...
// };


// export const callback = () => {
//   return (undefined, ": value")
// }
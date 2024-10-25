// import { useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';

// const loader = async ({request}) => {
//   console.log("Loader hit - request URL:", request.url);

//   const url = new URL(request.url);
//   const code = url.searchParams.get("code");
  
//   if (!code) {
//     console.log("Missing code, redirect failed.");
//     return new Response("Missing authorization code.", { status: 400 });
//   }
  
//   console.log("Code received:", code);
// }

// const ShopifyCallback = () => {
//   const [searchParams] = useSearchParams();
  
//   useEffect(() => {
//     const shop = searchParams.get('shop');
//     const code = searchParams.get('code');  // Capturing the authorization code
//     const hmac = searchParams.get('hmac');
//     const host = searchParams.get('host');
//     const state = searchParams.get('state');

//     console.log("Shop **** ", shop);
//     console.log("Code **** ", code);  // The Shopify authorization code
//     console.log("HMAC **** ", hmac);
//     console.log("State **** ", state);

//     // if (code) {
//     //   // Now that you have the code, you can make an API call to your backend to exchange it for an access token
//     //   fetch('/api/auth/token', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({
//     //       shop: shop,
//     //       code: code,
//     //     }),
//     //   })
//     //   .then(response => response.json())
//     //   .then(data => {
//     //     console.log("Access token received:", data.accessToken);
//     //     // Redirect the user to another page in your app (e.g., dashboard)
//     //     window.location.href = `/dashboard?shop=${shop}`;
//     //   })
//     //   .catch(error => {
//     //     console.error("Error exchanging code for token:", error);
//     //   });
//     // }
//   }, [searchParams]);

//   return (
//     <div>
//       <h1>Processing Shopify OAuth...</h1>
//     </div>
//   );
// };

// export default ShopifyCallback;

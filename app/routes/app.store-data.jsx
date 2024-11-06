import { json, redirect } from "@remix-run/node"; 
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { getToken } from "./app._index";

export const loader = async ({ request }) => {
  return json({request})
};


export const action = async ({ request }) => {

  const body = await request.json();

  console.log("Cart updated:", body);

  return json({ success: true });
};

export function CartData() {
  const {request} = useLoaderData();

  // if (!cart) {
  //   return <div>No cart found</div>;
  // }

  console.log(request)

  return (
    <div>
      <h1>Cart Information</h1>
      {getToken}
      {/* <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            Product: {item.product_title} <br />
            Quantity: {item.quantity}
          </li>
        ))}
      </ul> */}
    </div>
  );
}

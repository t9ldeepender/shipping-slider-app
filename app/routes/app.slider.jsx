import { json } from "@remix-run/node";

export function loader({response}) {
    return json({settings: "success", method : "GET"})
}


export function action({request}) {
    let method = request.method;

    switch(method){
        case "POST":
            return json({message:"Success", method:"POST"})
        case "PATCH":
            return json({message:"Warning", method:"PATCH"})
        case "DELETE":
            return json({message:"Danger", method:"DELETE"})
        default:
            throw new Response("Method not allowed", {status: 400})
    }

}
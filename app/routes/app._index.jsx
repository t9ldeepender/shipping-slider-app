import { useEffect } from "react";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Frame, MediaCard, Page } from "@shopify/polaris";
import { ErrorComponent } from "./components/error";
import { loader as authLoader } from "./Authloader";

// Export the loader for server-side use in Remix
export { authLoader as loader };

// help in setting the token in local storage
export const getToken = (token) => {
    return token
}

export default function Index() {
  const navigate = useNavigate();
  const { token } = useLoaderData();
  // const [toast, setToast] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      getToken(token)
    }
  }, [token]);

  const showToast = () => {
    navigate("/app/settings")
  }

  return (
    <Frame>
      {token ? (
        <div>
          <Page fullWidth>
            <MediaCard
              title="Go To Settings"
              primaryAction={{
                content: "Click To Set",
                onAction: () => {
                  console.log("Primary action clicked");
                  showToast();
                },
              }}
              description={`Let set your app settings`}
              popoverActions={[
                {
                  content: "Dismiss",
                  onAction: () => {
                    alert("Dismissed!");
                  },
                },
              ]}
            >
              <img
                alt="Media card visual"
                width="100%"
                height="100%"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src="/design-image.jpg" // Replace with your actual image path
              />
            </MediaCard>
          </Page>
          {/* {toastMarkup} */}
        </div>
      ) : (
        <div>
          <ErrorComponent errMessage={"No Data as you don't have token yet"} />
        </div>
      )}
    </Frame>
  );
}

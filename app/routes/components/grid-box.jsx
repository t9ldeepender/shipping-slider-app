import { Page, MediaCard } from '@shopify/polaris';
import "./component.css";
import { useNavigate } from '@remix-run/react';

export const GridWithMedia = ({ heading = "", content = "", button = false, action = null }) => {
  const navigate = useNavigate();
  
  const GotoSettings = () => {
    alert("Button Clicked");
  };
  
  return (
    <Page fullWidth>
      <MediaCard
        title={heading}
        primaryAction={{
          content: 'Click To Set',
          onAction: GotoSettings, // Pass the function without invoking it
        }}
        description={content}
        popoverActions={[{ content: 'Dismiss', onAction: () => { alert("toggle"); } }]}
      >
        <img
          alt=""
          width="100%"
          height="100%"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          src="/design-image.jpg"
        />
      </MediaCard>
    </Page>
  );
};


export function MediaCardExample() {
    return (
      <MediaCard
        title="Getting Started"
        primaryAction={{
          content: 'Learn about getting started',
          onAction: () => {},
        }}
        description="Discover how Shopify can power up your entrepreneurial journey."
        popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
      >
        <img
          alt=""
          width="100%"
          height="100%"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          src="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
        />
      </MediaCard>
    );
  }
import {Page, Grid, LegacyCard, Button, MediaCard } from '@shopify/polaris';
import React from 'react';
import "./component.css"

export function GridWithMedia({heading="",content="", button=false, route="/"}) {
  return (
    <Page fullWidth>
       <MediaCard
        title={heading}
        primaryAction={{
          content: 'Click To Set',
          onAction: () => {},
        }}
        description={content}
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
          src="/design-image.jpg"
        />
      </MediaCard>
    </Page>
  );
}

function MediaCardExample() {
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
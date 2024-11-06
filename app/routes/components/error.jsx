import React from 'react';
import {Bleed, Card, Text, InlineStack} from '@shopify/polaris';


export const ErrorComponent = (errMessage) => {
  return (
    <Card>
      <Text as="h2" variant="bodyMd">
        {errMessage}
      </Text>
      <Bleed marginInline="400">
        <Placeholder label="Error!" />
      </Bleed>
    </Card>
  );
}

export const Placeholder = ({label = '', height = 'auto', width = 'auto'}) => {
  return (
    <div
      style={{
        background: 'var(--p-color-text-info)',
        padding: '14px var(--p-space-200)',
        height: height,
        width: width,
      }}
    >
      <InlineStack gap="400" align="center">
        <div
          style={{
            color: 'var(--p-color-text-info-on-bg-fill)',
          }}
        >
          <Text
            as="h2"
            variant="bodyMd"
            fontWeight="regular"
            tone="text-inverse"
          >
            {label}
          </Text>
        </div>
      </InlineStack>
    </div>
  );
};
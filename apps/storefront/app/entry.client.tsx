import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { registerShopifyAdapter, registerUiCoreAdapter } from './adapter';

if (!(globalThis as any).__adaptersRegistered) {
  registerShopifyAdapter();
  registerUiCoreAdapter();
  (globalThis as any).__adaptersRegistered = true;
}

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });
}

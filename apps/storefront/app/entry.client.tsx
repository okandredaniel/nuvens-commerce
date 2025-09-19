import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';
import { registerUiCoreAdapter } from './core.adapter';

registerUiCoreAdapter();

if (import.meta.env.DEV) {
  import('@nuvens/ui/styles.css');
  import('@nuvens/brand-ui/styles.css');
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

import { getShopAnalytics } from '@shopify/hydrogen';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { getBrandPreset } from 'lib/config';
import { loadCriticalData } from 'lib/loader/critical.server';
import { loadDeferredData } from 'lib/loader/deferred.server';
import { Outlet } from 'react-router';

export type RootLoader = typeof loader;

export { ErrorBoundary } from '~/components/ErrorBoundary';
export { Layout } from '~/layouts/Layout';
export { links } from '../lib/links';
export { shouldRevalidate } from '../lib/revalidate';

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const { storefront, env } = args.context;
  const brand = getBrandPreset(env.BRAND_ID);

  return {
    ...deferredData,
    ...criticalData,
    brand,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({ storefront, publicStorefrontId: env.PUBLIC_STOREFRONT_ID }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

export default function App() {
  return <Outlet />;
}

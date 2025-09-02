import { getShopAnalytics } from '@shopify/hydrogen';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Outlet } from 'react-router';
import { loadCriticalData } from '~/lib/loader/critical.server';
import { loadDeferredData } from '~/lib/loader/deferred.server';
import { getRuntimeConfig } from './lib/runtime/getRuntimeConfig.server';

export type RootLoader = typeof loader;

export { ErrorBoundary } from '~/components/ErrorBoundary';
export { Layout } from '~/layouts/Layout';

export async function loader(args: LoaderFunctionArgs) {
  const runtime = getRuntimeConfig(args); // env (filtrado), brand e i18n centralizados
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const { storefront, env } = args.context;

  return {
    ...runtime,
    ...deferredData,
    ...criticalData,
    shop: getShopAnalytics({ storefront, publicStorefrontId: env.PUBLIC_STOREFRONT_ID }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  };
}

export default function App() {
  return <Outlet />;
}

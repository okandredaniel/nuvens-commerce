import { coreI18n } from '@nuvens/ui-core';
import { getShopAnalytics } from '@shopify/hydrogen';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Outlet } from 'react-router';
import { mergeResources, toLang } from '~/lib/i18n/i18n';
import { loadCriticalData } from '~/lib/loader/critical.server';
import { loadDeferredData } from '~/lib/loader/deferred.server';
import { getRuntimeConfig } from './lib/runtime/getRuntimeConfig.server';

export type RootLoader = typeof loader;
export { ErrorBoundary } from '~/components/ErrorBoundary';
export { Layout } from '~/layouts/Layout';

export async function loader(args: LoaderFunctionArgs) {
  const runtime = getRuntimeConfig(args);
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const { storefront, env } = args.context;
  const language = storefront.i18n.language.toLowerCase();
  const country = storefront.i18n.country.toLowerCase();
  const locale = `${language}-${country}`;
  const lang = toLang(locale);

  let brandI18n: any = null;
  try {
    const mod = await import('@nuvens/brand-ui');
    brandI18n = (mod as any).brandI18n ?? null;
  } catch {}

  const resources = mergeResources(locale, coreI18n as any, brandI18n as any);

  return {
    ...runtime,
    ...deferredData,
    ...criticalData,
    i18n: { locale, resources },
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
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

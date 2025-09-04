import { coreI18n } from '@nuvens/ui-core';
import { getShopAnalytics } from '@shopify/hydrogen';
import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { Outlet } from 'react-router';
import { loadCriticalData } from '~/lib/loader/critical.server';
import { loadDeferredData } from '~/lib/loader/deferred.server';
import { buildCanonical, buildHreflangs } from '~/lib/seo';
import { mergeResources, toLang } from './lib/i18n';
import { getRuntimeConfig } from './lib/runtime/getRuntimeConfig.server';

export type RootLoader = typeof loader;
export { ErrorBoundary } from '~/components/ErrorBoundary';
export { Layout } from '~/layouts/Layout';

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const base = data?.header?.shop?.primaryDomain?.url || data?.origin || '';
  const canonical = buildCanonical(base, location.pathname, location.search);
  const alts = buildHreflangs(base, location.pathname, location.search);
  return [
    { tagName: 'link', rel: 'canonical', href: canonical },
    ...alts.map((a) => ({ tagName: 'link', rel: 'alternate', hrefLang: a.hrefLang, href: a.href })),
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const runtime = getRuntimeConfig(args);
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  const { storefront, env } = args.context;
  const origin = new URL(args.request.url).origin;

  const firstSeg = new URL(args.request.url).pathname.split('/').filter(Boolean)[0] ?? '';
  const urlLang = /^[a-z]{2}$/i.test(firstSeg) ? firstSeg.toLowerCase() : undefined;

  const languageCtx = storefront.i18n.language.toLowerCase();
  const countryCtx = storefront.i18n.country.toLowerCase();

  const lang = toLang(urlLang ?? languageCtx);
  const localeRegion = `${languageCtx}-${countryCtx}`;

  let brandI18n: any = null;
  let brand: any = null;
  try {
    const mod = await import('@nuvens/brand-ui');
    const brandTokens = (mod as any).brandTokens;
    brandI18n = (mod as any).brandI18n ?? null;
    brand = { id: process.env.BRAND_ID, tokens: brandTokens };
  } catch {}

  const resources = mergeResources(lang, coreI18n?.resources, brandI18n?.resources);

  return {
    ...runtime,
    ...deferredData,
    ...criticalData,
    origin,
    brand,
    i18n: { locale: lang, resources },
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({ storefront, publicStorefrontId: env.PUBLIC_STOREFRONT_ID }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    localeRegion,
  };
}

export default function App() {
  return <Outlet />;
}

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/layouts/Layout';
import { getShopAnalytics } from '@shopify/hydrogen';
import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { Outlet } from 'react-router';
import { toLang } from './i18n/localize';
import { getAppResources, getBrandBundleResources } from './i18n/resources';
import { buildMetaLinks } from './lib/seo';
import { getBrandContext } from './server/brand';
import { loadCriticalData, loadDeferredData } from './server/data/loaders';
import { headers } from './server/http/headers';
import { links } from './server/http/links';
import { mergeI18nResources } from './server/i18n/merge';
import { resolvePathname } from './server/routing/resolvePathname';

export { shouldRevalidate } from './server/routing/shouldRevalidate';
export { ErrorBoundary, headers, Layout, links };

export async function loader(args: LoaderFunctionArgs) {
  const origin = new URL(args.request.url).origin;
  const { storefront, env } = args.context;

  const realPath = resolvePathname(args.request);

  const { brandI18n, brand } = await getBrandContext({ BRAND_ID: env.BRAND_ID });

  const firstSeg = realPath.split('/').filter(Boolean)[0] ?? '';
  const urlLang = /^[a-z]{2}$/i.test(firstSeg) ? firstSeg.toLowerCase() : undefined;

  const languageCtx = storefront.i18n.language.toLowerCase();
  const countryCtx = storefront.i18n.country.toLowerCase();

  const lang = toLang(urlLang ?? languageCtx);
  const country = countryCtx;
  const localeRegion = `${languageCtx}-${countryCtx}`;

  const deferredData = loadDeferredData(args, lang, country);
  const criticalData = await loadCriticalData(args, lang, country);

  const appRes = getAppResources(lang);
  const brandBundleRes = getBrandBundleResources(lang);
  const resources = mergeI18nResources(lang, brandI18n, brandBundleRes, appRes);

  return {
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

export type RootLoader = typeof loader;

export const meta: MetaFunction<RootLoader> = ({ data, location }) => {
  const base = data?.header?.shop?.primaryDomain?.url || data?.origin || '';
  return buildMetaLinks(base, location.pathname, location.search);
};

export default function App() {
  return <Outlet />;
}

import { coreI18n, evaluateRouteAccess, stripLocale } from '@nuvens/ui-core';
import { getShopAnalytics } from '@shopify/hydrogen';
import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { Outlet, useRouteLoaderData } from 'react-router';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { NotFoundView } from '~/components/error/NotFound';
import { FOOTER_QUERY, HEADER_QUERY } from '~/lib/fragments';
import { buildCanonical, buildHreflangs } from '~/lib/seo';
import { mergeResources, toLang } from './lib/i18n';

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
});

export type RootLoader = typeof loader;
export { ErrorBoundary } from '~/components/ErrorBoundary';
export { Layout } from '~/layouts/Layout';

type I18nNamespaces = Record<string, unknown>;
type I18nResources = Record<string, I18nNamespaces>;

function asResources(x: unknown): I18nResources {
  if (!x || typeof x !== 'object') return {};
  return x as I18nResources;
}

async function queryHeader(args: LoaderFunctionArgs, language: string, country: string) {
  const { storefront } = args.context;
  return storefront.query<HeaderQuery>(HEADER_QUERY, {
    variables: {
      headerMenuHandle: 'main-menu',
      language: language.toUpperCase(),
      country: country.toUpperCase(),
    } as any,
  });
}

function queryFooter(args: LoaderFunctionArgs, language: string, country: string) {
  const { storefront, env } = args.context;
  const handle = env.FOOTER_MENU_HANDLE;
  return storefront.query<FooterQuery>(FOOTER_QUERY, {
    variables: {
      footerMenuHandle: handle,
      language: language.toUpperCase(),
      country: country.toUpperCase(),
    } as any,
  });
}

export async function loadCriticalData(
  args: LoaderFunctionArgs,
  language: string,
  country: string,
) {
  const header = await queryHeader(args, language, country);
  return { header };
}

export function loadDeferredData(args: LoaderFunctionArgs, language: string, country: string) {
  const footer = queryFooter(args, language, country);
  const { context } = args;
  return {
    cart: context.cart.get(),
    isLoggedIn: context.customerAccount.isLoggedIn(),
    footer,
  };
}

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
  const origin = new URL(args.request.url).origin;
  const { storefront, env } = args.context;

  const currentPath = new URL(args.request.url).pathname || '/';
  const { path: pathWithoutLocale } = stripLocale(currentPath);

  let brandPolicy: any = null;
  try {
    const mod = await import('@nuvens/brand-ui');
    brandPolicy = (mod as any).routeAccessPolicy ?? null;
  } catch {}

  const routeBlocked =
    !!brandPolicy && evaluateRouteAccess(brandPolicy, pathWithoutLocale).allowed === false;

  const firstSeg = currentPath.split('/').filter(Boolean)[0] ?? '';
  const urlLang = /^[a-z]{2}$/i.test(firstSeg) ? firstSeg.toLowerCase() : undefined;

  const languageCtx = storefront.i18n.language.toLowerCase();
  const countryCtx = storefront.i18n.country.toLowerCase();

  const lang = toLang(urlLang ?? languageCtx);
  const country = countryCtx;
  const localeRegion = `${languageCtx}-${countryCtx}`;

  let brandI18n: any = null;
  let brand: any = null;
  try {
    const mod = await import('@nuvens/brand-ui');
    brandI18n = (mod as any).brandI18n ?? null;
    const brandTokens = (mod as any).brandTokens;
    brand = { id: process.env.BRAND_ID, tokens: brandTokens };
  } catch {}

  const deferredData = loadDeferredData(args, lang, country);
  const criticalData = await loadCriticalData(args, lang, country);

  const coreRes = asResources(coreI18n?.resources);
  const brandRes = asResources(brandI18n?.resources);

  const langs = Array.from(new Set([...Object.keys(coreRes), ...Object.keys(brandRes)]));

  const resources: I18nResources = langs.reduce((acc, l) => {
    const merged = mergeResources(l, coreRes, brandRes) as I18nNamespaces;
    return { ...acc, [l]: merged };
  }, {});

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
    routeBlocked,
  };
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root') as any;
  if (data?.routeBlocked) return <NotFoundView />;
  return <Outlet />;
}

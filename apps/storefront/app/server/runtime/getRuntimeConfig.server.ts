import type { BrandId } from '@/interfaces/brand.interface';
import type { RuntimeData, RuntimeEnv } from '@/interfaces/runtime.interface';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

function requireVar(name: string, v?: string): string {
  if (!v) throw new Error(`${name} is invalid or missing`);
  return v;
}

function detectI18nFromRequest(request: Request) {
  const url = new URL(request.url);
  const seg = url.pathname.split('/').filter(Boolean)[0] ?? '';
  let language: string | undefined;
  let country: string | undefined;

  if (/^[a-z]{2}$/i.test(seg)) language = seg.toUpperCase();

  const al = request.headers.get('accept-language') || '';
  const firstTag = al.split(',')[0]?.trim() || '';
  const [alLang, alRegion] = firstTag.split('-');
  if (!language && alLang) language = alLang.toUpperCase();
  if (!country && alRegion) country = alRegion.toUpperCase();

  const cfCountry =
    request.headers.get('CF-IPCountry') ||
    request.headers.get('X-Country') ||
    request.headers.get('X-Geo-Country') ||
    undefined;
  if (!country && cfCountry) country = cfCountry.toUpperCase();

  return {
    language: language || 'EN',
    country: country || 'US',
  };
}

export function getRuntimeConfig({ context, request }: LoaderFunctionArgs): RuntimeData {
  const env = context.env as any;

  const brandId = env.BRAND_ID as BrandId | undefined;
  if (!brandId) throw new Error('BRAND_ID is invalid or missing');

  const runtimeEnv: RuntimeEnv = {
    BRAND_ID: brandId,
    PUBLIC_STORE_DOMAIN: requireVar('PUBLIC_STORE_DOMAIN', env.PUBLIC_STORE_DOMAIN),
    PUBLIC_STOREFRONT_ID: requireVar('PUBLIC_STOREFRONT_ID', env.PUBLIC_STOREFRONT_ID),
    PUBLIC_STOREFRONT_API_TOKEN: requireVar(
      'PUBLIC_STOREFRONT_API_TOKEN',
      env.PUBLIC_STOREFRONT_API_TOKEN,
    ),
    PUBLIC_CHECKOUT_DOMAIN: requireVar('PUBLIC_CHECKOUT_DOMAIN', env.PUBLIC_CHECKOUT_DOMAIN),
    PRIVATE_STOREFRONT_API_TOKEN: env.PRIVATE_STOREFRONT_API_TOKEN,
  };

  const langCtx = (context as any)?.storefront?.i18n?.language as string | undefined;
  const countryCtx = (context as any)?.storefront?.i18n?.country as string | undefined;
  const detected = detectI18nFromRequest(request);

  return {
    env: runtimeEnv,
    brand: { id: brandId },
    i18n: {
      language: (langCtx || detected.language).toUpperCase(),
      country: (countryCtx || detected.country).toUpperCase(),
    },
    languages: undefined,
  };
}

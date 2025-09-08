import { getBrandTokensById, type BrandId } from '@nuvens/brand-tokens';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type { RuntimeData } from './types';

export function getRuntimeConfig({ context }: LoaderFunctionArgs): RuntimeData {
  const { env, storefront } = context;

  const brandId = env.BRAND_ID as BrandId | undefined;
  if (!brandId) throw new Error('BRAND_ID is invalid or missing');

  const tokens = getBrandTokensById(brandId);

  const runtimeEnv = {
    BRAND_ID: env.BRAND_ID,
    PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
    PUBLIC_STOREFRONT_ID: env.PUBLIC_STOREFRONT_ID,
    PUBLIC_CHECKOUT_DOMAIN: env.PUBLIC_CHECKOUT_DOMAIN,
  };

  const i18n = {
    language: storefront.i18n.language,
    country: storefront.i18n.country,
  };

  return {
    env: runtimeEnv,
    brand: { id: brandId, tokens },
    i18n,
    languages: undefined,
  };
}

import type { BrandId } from '@/interfaces/brand.interface';
import type { RuntimeData, RuntimeEnv } from '@/interfaces/runtime.interface';
import { brandTokens } from '@nuvens/brand-ui';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

function requireVar(name: string, v?: string): string {
  if (!v) throw new Error(`${name} is invalid or missing`);
  return v;
}

export function getRuntimeConfig({ context }: LoaderFunctionArgs): RuntimeData {
  const { env, storefront } = context;

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
  };

  return {
    env: runtimeEnv,
    brand: { id: brandId, tokens: brandTokens },
    i18n: {
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
    languages: undefined,
  };
}

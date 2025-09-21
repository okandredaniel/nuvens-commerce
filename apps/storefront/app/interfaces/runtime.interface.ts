import type { BrandId } from '@/interfaces/brand.interface';

export type RuntimeEnv = {
  BRAND_ID: string;
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_ID: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_CHECKOUT_DOMAIN: string;
  PRIVATE_STOREFRONT_API_TOKEN: string;
};

export type RuntimeConfig = {
  env: RuntimeEnv;
};

export type RuntimeData = {
  env: RuntimeEnv;
  brand: { id: BrandId };
  i18n: { language: string; country: string };
  languages?: string[];
};

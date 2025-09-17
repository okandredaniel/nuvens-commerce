import type { BrandId } from '@/interfaces/brand.interface';

export type RuntimeEnv = {
  BRAND_ID: string;
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_STOREFRONT_ID: string;
  PUBLIC_CHECKOUT_DOMAIN: string;
};

export type RuntimeData = {
  env: RuntimeEnv;
  brand: { id: BrandId; tokens: any };
  i18n: { language: string; country: string };
  languages?: string[];
};

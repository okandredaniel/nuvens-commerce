import type { BrandId, DesignTokens } from '@nuvens/ui-core';
import type { LanguageOption } from '~/components/header/header.interfaces';

export type RuntimeEnv = {
  BRAND_ID?: string;
  PUBLIC_STORE_DOMAIN?: string;
  PUBLIC_STOREFRONT_ID?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
  PUBLIC_CHECKOUT_DOMAIN?: string;
};

export type RuntimeBrand = {
  id: BrandId;
  tokens: DesignTokens;
};

export type RuntimeI18n = {
  language: string;
  country: string;
  pathPrefix?: string;
};

export type RuntimeData = {
  env: RuntimeEnv;
  brand: RuntimeBrand;
  i18n: RuntimeI18n;
  languages?: LanguageOption[];
};

// types/env.d.ts
export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BRAND_ID?: string;

      SHOPIFY_STORE_DOMAIN?: string;
      SHOPIFY_STOREFRONT_API_TOKEN?: string;
      SHOPIFY_STOREFRONT_API_VERSION?: string;

      SHOPIFY_CUSTOMER_ACCOUNT_API_URL?: string;
      SHOPIFY_CUSTOMER_ACCOUNT_ID?: string;
      SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID?: string;

      SHOPIFY_CHECKOUT_DOMAIN?: string;
    }
  }

  interface ImportMetaEnv {
    readonly VITE_BRAND_ID?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

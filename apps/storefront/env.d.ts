/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

import type { createAppLoadContext } from '@/server/context';
import type { HydrogenEnv, HydrogenSessionData } from '@shopify/hydrogen';
import '@total-typescript/ts-reset';

declare global {
  interface Env extends HydrogenEnv {
    BRAND_ID: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_ID: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_CHECKOUT_DOMAIN: string;
    PRIVATE_STOREFRONT_API_TOKEN: string;
    HEADER_MENU_HANDLE?: string;
    FOOTER_MENU_HANDLE?: string;
    SESSION_SECRET: string;
  }
}

declare module 'react-router' {
  interface AppLoadContext extends Awaited<ReturnType<typeof createAppLoadContext>> {}
  interface LoaderFunctionArgs {
    context: AppLoadContext;
  }
  interface ActionFunctionArgs {
    context: AppLoadContext;
  }
  interface SessionData extends HydrogenSessionData {}
}

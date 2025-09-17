/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

import type { createAppLoadContext } from '@lib/context';
import type { HydrogenEnv, HydrogenSessionData } from '@shopify/hydrogen';
import '@total-typescript/ts-reset';

declare global {
  interface Env extends HydrogenEnv {
    BRAND_ID?: string;
    HEADER_MENU_HANDLE?: string;
    FOOTER_MENU_HANDLE?: string;
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

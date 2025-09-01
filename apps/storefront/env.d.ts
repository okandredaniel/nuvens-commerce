/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

import '@total-typescript/ts-reset';
import type { HydrogenSessionData, HydrogenEnv } from '@shopify/hydrogen';
import type { createAppLoadContext } from '~/lib/context';

declare global {
  interface Env extends HydrogenEnv {
    BRAND_ID?: string;
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

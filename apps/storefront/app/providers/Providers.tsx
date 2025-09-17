import { createI18n } from '@/i18n/createInstance';
import { toLang } from '@/i18n/localize';
import { getAppResources } from '@/i18n/resources';
import type { RootLoader } from '@/root';
import { resolvePolicyPath } from '@lib/routing/paths';
import { coreI18n } from '@nuvens/core';
import { Aside, coreTokens, mergeTokens, tokensToCssVars } from '@nuvens/ui';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Analytics } from '@shopify/hydrogen';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import { ProvidersMap, useBrand, useShallowMemo } from './AppContexts';

type ProvidersProps = { children?: React.ReactNode };

let LAST_ROOT_DATA: any;

export function Providers({ children }: ProvidersProps) {
  const routeData = useRouteLoaderData<RootLoader>('root') as any;
  if (routeData !== undefined) LAST_ROOT_DATA = routeData;
  const data = routeData ?? LAST_ROOT_DATA ?? null;

  const languageCtx = data?.i18n?.locale ?? data?.consent?.language ?? 'en';
  const lang = toLang((languageCtx || 'en').toLowerCase());

  const appRes = getAppResources(lang);
  const coreRes = (coreI18n?.resources?.[lang] ?? {}) as Record<string, any>;
  const serverRes = (data?.i18n?.resources ?? {}) as Record<string, any>;

  const ns = new Set([...Object.keys(coreRes), ...Object.keys(serverRes), ...Object.keys(appRes)]);
  const merged: Record<string, any> = {};
  ns.forEach(
    (k) => (merged[k] = { ...(coreRes[k] ?? {}), ...(serverRes[k] ?? {}), ...(appRes[k] ?? {}) }),
  );

  const i18n = createI18n(lang, merged);
  if (import.meta.env.DEV) (globalThis as any).__i18n = i18n;

  const brandTokens = data?.brand?.tokens ?? {};
  const mergedTokens = mergeTokens(coreTokens, brandTokens);
  const cssVars = tokensToCssVars(mergedTokens).join('');

  const storeValue = useShallowMemo({
    publicStoreDomain: data?.publicStoreDomain,
    primaryDomainUrl: data?.header?.shop?.primaryDomain?.url,
    footer: data?.footer ?? null,
    header: data?.header ?? null,
    routing: {
      resolvePolicyPath: (p: string) => resolvePolicyPath(p),
      candidates: ['/', '/collections', '/pages', '/policies'],
    },
  });

  const cartPromise = data?.cart ?? null;
  const cartValue = useShallowMemo({ cart: cartPromise });
  const userValue = useShallowMemo({ isLoggedIn: !!data?.isLoggedIn });
  const brandValue = useShallowMemo({ brandId: data?.brand?.id, cssVars });

  return (
    <I18nextProvider i18n={i18n}>
      <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
        <Analytics.Provider cart={cartPromise} shop={data?.shop} consent={data?.consent}>
          <ProvidersMap.Brand value={brandValue}>
            <ProvidersMap.Store value={storeValue}>
              <ProvidersMap.User value={userValue}>
                <ProvidersMap.Cart value={cartValue}>
                  <Aside.Provider>{children}</Aside.Provider>
                </ProvidersMap.Cart>
              </ProvidersMap.User>
            </ProvidersMap.Store>
          </ProvidersMap.Brand>
        </Analytics.Provider>
      </Tooltip.Provider>
    </I18nextProvider>
  );
}

export function BrandStyleTag() {
  const { cssVars } = useBrand();
  if (!cssVars) return null;
  return <style id="brand-vars">{`:root{${cssVars}}`}</style>;
}

import { brandDefaultLocale } from '@/brand-ui.generated';
import { resolvePolicyPath } from '@/lib/routing/paths';
import type { RootLoader } from '@/root';
import { coreI18n } from '@nuvens/core';
import { createI18n, getEffectiveLang, loadAppDictionaries } from '@nuvens/shopify';
import { Aside, Tooltip } from '@nuvens/ui';
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

  const lang = getEffectiveLang(brandDefaultLocale, data);

  const appRes = loadAppDictionaries(lang);
  const coreRes = (coreI18n?.resources?.[lang] ?? {}) as Record<string, any>;
  const serverRes = (data?.i18n?.resources ?? {}) as Record<string, any>;

  const ns = new Set([...Object.keys(coreRes), ...Object.keys(serverRes), ...Object.keys(appRes)]);
  const merged: Record<string, any> = {};
  ns.forEach((k) => {
    merged[k] = { ...(coreRes[k] ?? {}), ...(serverRes[k] ?? {}), ...(appRes[k] ?? {}) };
  });

  const i18n = createI18n(lang, merged);
  if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
    (globalThis as any).__i18n = i18n;
  }

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

  const cartPromise: any = data?.cart ?? null;
  const userValue = useShallowMemo({ isLoggedIn: !!data?.isLoggedIn });
  const brandValue = useShallowMemo({ brandId: data?.brand?.id });

  return (
    <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
      <Aside.Provider>
        <ProvidersMap.Brand value={brandValue}>
          <ProvidersMap.Store value={storeValue}>
            <ProvidersMap.User value={userValue}>
              <ProvidersMap.Cart value={cartPromise}>
                <I18nextProvider i18n={i18n}>
                  <Analytics.Provider cart={cartPromise} shop={data?.shop} consent={data?.consent}>
                    {children}
                  </Analytics.Provider>
                </I18nextProvider>
              </ProvidersMap.Cart>
            </ProvidersMap.User>
          </ProvidersMap.Store>
        </ProvidersMap.Brand>
      </Aside.Provider>
    </Tooltip.Provider>
  );
}

export function BrandStyleTag() {
  const { cssVars } = useBrand();
  if (!cssVars) return null;
  return <style id="brand-vars">{`:root{${cssVars}}`}</style>;
}

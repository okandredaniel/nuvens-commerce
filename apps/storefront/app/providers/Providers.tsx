import { Aside, coreI18n, coreTokens, mergeTokens, tokensToCssVars } from '@nuvens/ui-core';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Analytics } from '@shopify/hydrogen';
import { I18nextProvider } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import { I18nBridge, mergeResources, toLang } from '~/lib/i18n';
import { registerI18nBundles } from '~/lib/i18n/autoBundles';
import { createI18n } from '~/lib/i18n/createInstance';
import type { RootLoader } from '~/root';
import { ProvidersMap, useBrand, useShallowMemo } from './AppContexts';

type ProvidersProps = { children?: React.ReactNode };

export function Providers({ children }: ProvidersProps) {
  const data = useRouteLoaderData<RootLoader>('root');

  const languageCtx = data?.i18n?.locale ?? data?.consent?.language ?? 'en';
  const lang = toLang((languageCtx || 'en').toLowerCase());
  const resources = mergeResources(lang, coreI18n?.resources, data?.i18n?.resources);
  const i18n = createI18n(lang, resources ?? {});
  registerI18nBundles(i18n);
  if (import.meta.env.DEV) (globalThis as any).__i18n = i18n;

  const brandTokens = (data as any)?.brand?.tokens ?? {};
  const mergedTokens = mergeTokens(coreTokens, brandTokens);
  const cssVars = tokensToCssVars(mergedTokens).join('');

  const storeValue = useShallowMemo({
    publicStoreDomain: data?.publicStoreDomain,
    primaryDomainUrl: data?.header?.shop?.primaryDomain?.url,
    footer: (data as any)?.footer,
    header: (data as any)?.header ?? null,
  });
  const cartValue = useShallowMemo({ cart: (data as any)?.cart });
  const userValue = useShallowMemo({ isLoggedIn: !!(data as any)?.isLoggedIn });
  const brandValue = useShallowMemo({ brandId: (data as any)?.brand?.id, cssVars });

  return (
    <I18nextProvider i18n={i18n}>
      <I18nBridge />
      <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
        <Analytics.Provider
          cart={(data as any)?.cart}
          shop={(data as any)?.shop}
          consent={(data as any)?.consent}
        >
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

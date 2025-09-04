import { Aside } from '@nuvens/ui-core';
import { Analytics } from '@shopify/hydrogen';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { i18n } from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { I18nBridge } from '~/lib/i18n';

type ProvidersProps = {
  i18n: i18n;
  analytics: { cart: any; shop: any; consent: any };
  children?: React.ReactNode;
};

export function Providers({ i18n, analytics, children }: ProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <I18nBridge />
      <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
        <Analytics.Provider cart={analytics.cart} shop={analytics.shop} consent={analytics.consent}>
          <Aside.Provider>{children}</Aside.Provider>
        </Analytics.Provider>
      </Tooltip.Provider>
    </I18nextProvider>
  );
}

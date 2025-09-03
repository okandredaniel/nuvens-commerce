import { brandDefaultLocale } from '@nuvens/brand-ui';
import { Analytics, useNonce } from '@shopify/hydrogen';
import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Links, Meta, Scripts, ScrollRestoration, useRouteLoaderData } from 'react-router';
import { Aside } from '~/components/Aside';
import { CartAside } from '~/components/CartAside';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/header/Header';
import { MobileMenuAside } from '~/components/MobileMenuAside';
import { SearchAside } from '~/components/SearchAside';
import { createI18n } from '~/lib/i18n/createInstance';
import { RootLoader } from '~/root';
import appStyles from '~/styles/app.css?url';
import tailwindCss from '~/styles/tailwind.css?url';

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');

  const normalize = (tag?: string) =>
    (tag?.split?.('-')[0] || brandDefaultLocale || 'en').toLowerCase();
  const locale = normalize(data?.i18n?.locale || data?.consent?.language);

  const i18n = useMemo(
    () => createI18n(locale, data?.i18n?.resources ?? {}),
    [locale, data?.i18n?.resources],
  );

  const globalTokens: { colors: Record<string, string> } = { colors: {} };
  const brandTokens = data?.brand?.tokens;
  const colors = { ...globalTokens.colors, ...(brandTokens?.colors ?? {}) };
  const cssVars = Object.entries(colors).map(([key, value]) => `--color-${key}:${value};`);

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss} />
        <link rel="stylesheet" href={appStyles} />
        <Meta />
        <Links />
        {cssVars.length > 0 && <style id="brand-vars">{`:root{${cssVars.join('')}}`}</style>}
      </head>
      <body data-brand={data?.brand?.id}>
        <I18nextProvider i18n={i18n}>
          {data ? (
            <Analytics.Provider cart={data?.cart} shop={data?.shop} consent={data?.consent}>
              <Aside.Provider>
                <CartAside cart={data?.cart as any} />
                <SearchAside />
                {data?.header && data?.publicStoreDomain && (
                  <MobileMenuAside
                    header={data.header}
                    publicStoreDomain={data.publicStoreDomain}
                  />
                )}
                {data?.header && (
                  <Header
                    header={data.header}
                    cart={data.cart as any}
                    isLoggedIn={data.isLoggedIn as any}
                    publicStoreDomain={data.publicStoreDomain as any}
                  />
                )}
                <main>{children}</main>
                <Footer
                  footer={(data as any)?.footer}
                  publicStoreDomain={data?.publicStoreDomain as any}
                  primaryDomainUrl={data?.header?.shop?.primaryDomain?.url as any}
                />
              </Aside.Provider>
            </Analytics.Provider>
          ) : (
            children
          )}
        </I18nextProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

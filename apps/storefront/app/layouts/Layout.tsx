import { brandDefaultLocale } from '@nuvens/brand-ui';
import { useNonce } from '@shopify/hydrogen';
import { useMemo } from 'react';
import { Links, Meta, Scripts, ScrollRestoration, useRouteLoaderData } from 'react-router';
import { CartAside } from '~/components/CartAside';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/header/Header';
import { MobileMenuAside } from '~/components/MobileMenuAside';
import { SearchAside } from '~/components/SearchAside';
import { createI18n } from '~/lib/i18n/createInstance';
import { Providers } from '~/providers/Providers';
import { RootLoader } from '~/root';
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

  const colors = { ...(data?.brand?.tokens?.colors ?? {}) };
  const cssVars = Object.entries(colors).map(([k, v]) => `--color-${k}:${v};`);

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss} />
        <Meta />
        <Links />
        {cssVars.length > 0 && <style id="brand-vars">{`:root{${cssVars.join('')}}`}</style>}
      </head>
      <body data-brand={data?.brand?.id}>
        <Providers
          i18n={i18n}
          analytics={{ cart: data?.cart, shop: data?.shop, consent: data?.consent }}
        >
          {data ? (
            <>
              <CartAside cart={data?.cart as any} />
              <SearchAside />
              {data?.header && data?.publicStoreDomain && (
                <MobileMenuAside header={data.header} publicStoreDomain={data.publicStoreDomain} />
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
            </>
          ) : (
            children
          )}
        </Providers>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

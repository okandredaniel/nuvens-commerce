import { Analytics, useNonce } from '@shopify/hydrogen';
import { Links, Meta, Scripts, ScrollRestoration, useRouteLoaderData } from 'react-router';
import { PageLayout } from '~/components/PageLayout';
import { RootLoader } from '~/root';
import appStyles from '~/styles/app.css?url';
import tailwindCss from '~/styles/tailwind.css?url';

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');

  const globalTokens: { colors: Record<string, string> } = { colors: {} };
  const brandTokens = data?.brand?.tokens;
  const colors = { ...globalTokens.colors, ...(brandTokens?.colors ?? {}) };
  const cssVars = Object.entries(colors).map(([key, value]) => `--color-${key}:${value};`);

  return (
    <html lang={data?.consent?.language.toLowerCase() || 'en'}>
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
        {data ? (
          <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
            <PageLayout {...data}>{children}</PageLayout>
          </Analytics.Provider>
        ) : (
          children
        )}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

import { brandDefaultLocale } from '@nuvens/brand-ui';
import { useNonce } from '@shopify/hydrogen';
import { Links, Meta, Scripts, ScrollRestoration, useMatches } from 'react-router';
import { CartAside } from '~/components/cart';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { MobileMenuAside } from '~/components/MobileMenuAside';
import { BrandStyleTag, Providers } from '~/providers/Providers';

type HeaderPref = 'transparent' | 'solid';
type RouteHandle = { header?: HeaderPref };

function useHeaderPref(): HeaderPref | undefined {
  const matches = useMatches();
  for (let i = matches.length - 1; i >= 0; i--) {
    const h = (matches[i] as unknown as { handle?: RouteHandle }).handle;
    if (h?.header) return h.header;
  }
  return undefined;
}

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const locale = (brandDefaultLocale || 'en').toLowerCase();
  const headerPref = useHeaderPref();
  const wantsTransparent = headerPref === 'transparent';
  const mainPadding = wantsTransparent ? 'pt-0' : 'pt-16';

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>
          <BrandStyleTag />
          <CartAside />
          <MobileMenuAside />
          <Header pref={headerPref} />
          <main className={mainPadding}>{children}</main>
          <Footer />
        </Providers>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

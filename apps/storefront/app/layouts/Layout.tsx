import { BrandStyleTag, Providers } from '@/providers/Providers';
import { CartContainer } from '@/shell/CartContainer';
import { FooterContainer } from '@/shell/FooterContainer';
import { HeaderContainer } from '@/shell/HeaderContainer';
import { Brand, brandDefaultLocale } from '@nuvens/brand-ui';
import { getEffectiveLang, MobileMenuAside } from '@nuvens/shopify';
import { useNonce } from '@shopify/hydrogen';
import type { PropsWithChildren } from 'react';
import { Component } from 'react';
import {
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useMatches,
  useRouteLoaderData,
} from 'react-router';

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

class SafeBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export function Layout({ children }: PropsWithChildren) {
  const nonce = useNonce();
  const rootData = useRouteLoaderData('root') as any;
  const locale = getEffectiveLang(brandDefaultLocale, rootData);
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
          <SafeBoundary>
            <CartContainer />
          </SafeBoundary>
          <MobileMenuAside />
          <HeaderContainer headerPref={headerPref} Brand={Brand} />
          <main className={mainPadding}>{children}</main>
          <FooterContainer Brand={Brand} />
        </Providers>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

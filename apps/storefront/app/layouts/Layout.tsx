import { brandDefaultLocale } from '@nuvens/brand-ui';
import { useNonce } from '@shopify/hydrogen';
import { Links, Meta, Scripts, ScrollRestoration } from 'react-router';
import { CartAside } from '~/components/cart';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { MobileMenuAside } from '~/components/MobileMenuAside';
import { BrandStyleTag, Providers } from '~/providers/Providers';
import tailwindCss from '~/styles/tailwind.css?url';

export function Layout({ children }: { children?: React.ReactNode }) {
  const nonce = useNonce();
  const locale = (brandDefaultLocale || 'en').toLowerCase();

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss} />
        <Meta />
        <Links />
      </head>
      <body>
        <Providers>
          <BrandStyleTag />
          <CartAside />
          <MobileMenuAside />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

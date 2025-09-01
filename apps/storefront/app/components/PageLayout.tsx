import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { Aside } from '~/components/Aside';

export interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      {/* <CartAside cart={cart} /> */}
      {/* <SearchAside /> */}
      {/* <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} /> */}
      {/* {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )} */}
      <main>{children}</main>
      {/* <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} /> */}
    </Aside.Provider>
  );
}

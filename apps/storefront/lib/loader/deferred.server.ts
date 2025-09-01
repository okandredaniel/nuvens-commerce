import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { FOOTER_QUERY } from '~/lib/fragments';

export function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { storefront, customerAccount, cart } = context;
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: { footerMenuHandle: 'footer' },
    })
    .catch(() => null);

  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

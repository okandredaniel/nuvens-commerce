import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type { FooterQuery } from 'storefrontapi.generated';
import { FOOTER_QUERY } from '~/lib/fragments';
import { sfQuery } from '../i18n/storefront.server';

export function loadDeferredData(args: LoaderFunctionArgs) {
  const { context } = args;

  const footer = sfQuery<FooterQuery>(args, FOOTER_QUERY, {
    footerMenuHandle: 'footer',
  });

  return {
    cart: context.cart.get(),
    isLoggedIn: context.customerAccount.isLoggedIn(),
    footer,
  };
}

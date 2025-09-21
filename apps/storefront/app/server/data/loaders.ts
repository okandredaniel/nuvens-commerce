import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { queryFooter } from '../queries/footer';
import { queryHeader } from '../queries/header';

export async function loadCriticalData(
  args: LoaderFunctionArgs,
  language: string,
  country: string,
) {
  const header = await queryHeader(args, language, country);
  return { header };
}

export function loadDeferredData(args: LoaderFunctionArgs, language: string, country: string) {
  const footer = queryFooter(args, language, country);
  const c: any = args.context;

  const cart =
    typeof c?.cart?.get === 'function' ? c.cart.get() : (Promise.resolve(null) as Promise<unknown>);
  const isLoggedIn =
    typeof c?.customerAccount?.isLoggedIn === 'function' ? c.customerAccount.isLoggedIn() : false;

  return {
    cart,
    isLoggedIn,
    footer,
  };
}

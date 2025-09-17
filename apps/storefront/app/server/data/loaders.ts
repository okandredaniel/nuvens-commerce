import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { queryHeader } from '../queries/header';
import { queryFooter } from '../queries/footer';

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
  const { context } = args;
  return {
    cart: context.cart.get(),
    isLoggedIn: context.customerAccount.isLoggedIn(),
    footer,
  };
}

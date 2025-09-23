import { FOOTER_QUERY } from '@/lib/fragments';
import type { FooterQuery } from '@nuvens/shopify';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

export function queryFooter(args: LoaderFunctionArgs, language: string, country: string) {
  const handle = (args.context.env as Env).FOOTER_MENU_HANDLE;
  return args.context.storefront.query<FooterQuery>(FOOTER_QUERY, {
    variables: {
      footerMenuHandle: handle,
      language: language.toUpperCase(),
      country: country.toUpperCase(),
    } as any,
  });
}

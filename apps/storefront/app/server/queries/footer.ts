import { FOOTER_QUERY } from '@lib/fragments';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type { FooterQuery } from 'storefrontapi.generated';

export function queryFooter(args: LoaderFunctionArgs, language: string, country: string) {
  const { storefront, env } = args.context;
  const handle = env.FOOTER_MENU_HANDLE;
  return storefront.query<FooterQuery>(FOOTER_QUERY, {
    variables: {
      footerMenuHandle: handle,
      language: language.toUpperCase(),
      country: country.toUpperCase(),
    } as any,
  });
}

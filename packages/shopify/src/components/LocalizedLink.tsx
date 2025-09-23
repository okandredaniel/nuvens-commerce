import { NavLink as RRLink, type LinkProps as RRLinkProps } from 'react-router';
import { useShopifyAdapter } from '../shopify-adapter';

export function LocalizedLink({ to, ...rest }: RRLinkProps) {
  const { useLocalizedHref } = useShopifyAdapter();
  const localize = useLocalizedHref();
  return <RRLink suppressHydrationWarning to={localize(to)} {...rest} />;
}

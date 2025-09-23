import { cn } from '@nuvens/ui';
import { NavLink as RRNavLink, type NavLinkProps as RRNavLinkProps } from 'react-router';
import { useShopifyAdapter } from '../shopify-adapter';

export function LocalizedNavLink({ to, className, ...rest }: RRNavLinkProps) {
  const { useLocalizedHref } = useShopifyAdapter();
  const localize = useLocalizedHref();
  return (
    <RRNavLink
      suppressHydrationWarning
      to={localize(to)}
      className={cn('inline-block', className)}
      {...rest}
    />
  );
}

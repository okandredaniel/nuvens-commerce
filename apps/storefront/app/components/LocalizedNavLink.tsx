import { cn } from '@nuvens/ui-core';
import { NavLink as RRNavLink, type NavLinkProps as RRNavLinkProps } from 'react-router';
import { useLocalizedHref } from '~/hooks/useLocalizedHref';

export function LocalizedNavLink({ to, className, ...rest }: RRNavLinkProps) {
  const localize = useLocalizedHref();
  return <RRNavLink to={localize(to)} className={cn('inline-block', className)} {...rest} />;
}

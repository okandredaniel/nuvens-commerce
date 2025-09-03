import { NavLink as RRNavLink, type NavLinkProps as RRNavLinkProps } from 'react-router';
import { useLocalizedHref } from '~/hooks/useLocalizedHref';

export function LocalizedNavLink(props: RRNavLinkProps) {
  const localize = useLocalizedHref();
  const { to, ...rest } = props;
  return <RRNavLink to={localize(to)} {...rest} />;
}

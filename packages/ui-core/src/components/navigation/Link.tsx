import { CoreLinkProps, CoreNavLinkProps, useCoreAdapter } from '../../adapters';

export function Link(props: CoreLinkProps) {
  const { Link } = useCoreAdapter();
  return <Link {...props} />;
}

export function NavLink(props: CoreNavLinkProps) {
  const { NavLink } = useCoreAdapter();
  return <NavLink {...props} />;
}

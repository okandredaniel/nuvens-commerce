import type { CoreLinkProps, CoreNavLinkProps } from '../../adapters/adapters.interface';
import { useCoreAdapter } from '../../adapters/core-adapter';
import { cn } from '../../utils/cn';

const base =
  'inline-flex py-1 px-2 underline text-[var(--palette-primary-500)] hover:text-[var(--palette-primary-600)]';

export function Link({ className, ...props }: CoreLinkProps) {
  const { Link: AdapterLink } = useCoreAdapter();
  return <AdapterLink className={cn(base, className)} {...props} />;
}

export function NavLink({ className, ...props }: CoreNavLinkProps) {
  const { NavLink: AdapterNavLink } = useCoreAdapter();
  return <AdapterNavLink className={cn(base, className)} {...props} />;
}

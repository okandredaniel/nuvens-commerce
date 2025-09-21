import type { CoreLinkProps, CoreNavLinkProps } from '@nuvens/core';
import { useCoreAdapter } from '@nuvens/core';
import { cn } from '../../utils/cn';

const base =
  'inline-flex py-1 px-2 underline text-[var(--palette-primary-500)] hover:text-[var(--palette-primary-600)]';

export function Link({ className, ...props }: CoreLinkProps) {
  const { Link: AdapterLink } = useCoreAdapter();
  const any = props as any;
  const compatProps = {
    ...any,
    href: any.href ?? any.to,
    to: any.to ?? any.href,
  };
  return <AdapterLink className={cn(base, className)} {...compatProps} />;
}

export function NavLink({ className, ...props }: CoreNavLinkProps) {
  const { NavLink: AdapterNavLink } = useCoreAdapter();
  const any = props as any;
  const compatProps = {
    ...any,
    href: any.href ?? any.to,
    to: any.to ?? any.href,
  };
  return <AdapterNavLink className={cn(base, className)} {...compatProps} />;
}

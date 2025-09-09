import type { AnchorHTMLAttributes, ComponentType, ReactNode } from 'react';
import { createContext, useContext } from 'react';

export type CoreLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
};
export type CoreNavLinkProps = CoreLinkProps & { end?: boolean; prefetch?: 'intent' | 'none' };

export type CoreAdapter = {
  Link?: ComponentType<CoreLinkProps>;
  NavLink?: ComponentType<CoreNavLinkProps>;
  track?: (event: string, payload?: unknown) => void;
  getLocale?: () => string;
};

const DefaultLink = ({ to, children, ...rest }: CoreLinkProps) => (
  <a href={to} {...rest}>
    {children}
  </a>
);
const DefaultNavLink = ({ end: _end, prefetch: _prefetch, ...rest }: CoreNavLinkProps) => (
  <DefaultLink {...rest} />
);

let registry: CoreAdapter = {};
export function setCoreAdapter(partial: Partial<CoreAdapter>) {
  const defined = Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined));
  registry = { ...registry, ...defined };
}
export function getCoreAdapter(): CoreAdapter {
  return registry;
}

const Ctx = createContext<CoreAdapter | null>(null);
export function CoreAdapterProvider({
  value,
  children,
}: {
  value: Partial<CoreAdapter>;
  children: ReactNode;
}) {
  const defined = Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));
  const merged = { ...getCoreAdapter(), ...defined };
  return <Ctx.Provider value={merged}>{children}</Ctx.Provider>;
}

export function useCoreAdapter(): Required<Pick<CoreAdapter, 'Link' | 'NavLink'>> & CoreAdapter {
  const ctx = useContext(Ctx) ?? getCoreAdapter();
  return {
    Link: ctx.Link ?? DefaultLink,
    NavLink: ctx.NavLink ?? DefaultNavLink,
    ...ctx,
  };
}

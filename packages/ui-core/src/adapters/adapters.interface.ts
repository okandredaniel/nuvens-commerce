import type { AnchorHTMLAttributes, ComponentType } from 'react';

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

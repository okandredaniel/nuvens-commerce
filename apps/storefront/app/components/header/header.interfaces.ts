import type { HeaderQuery, CartApiQueryFragment } from 'storefrontapi.generated';

export type Viewport = 'desktop' | 'mobile';

export interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export interface LanguageOption {
  isoCode: string;
  href: string;
  label?: string;
}

import { createContext, useContext, useMemo } from 'react';
import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from 'storefrontapi.generated';

type StoreCtx = {
  publicStoreDomain?: string;
  primaryDomainUrl?: string;
  footer?: Promise<FooterQuery | null> | null;
  header?: HeaderQuery | null;
};

type CartCtx = {
  cart: Promise<CartApiQueryFragment | null> | null;
};

type UserCtx = { isLoggedIn: boolean };
type BrandCtx = { brandId?: string; cssVars?: string };

const StoreContext = createContext<StoreCtx | undefined>(undefined);
const CartContext = createContext<CartCtx | undefined>(undefined);
const UserContext = createContext<UserCtx | undefined>(undefined);
const BrandContext = createContext<BrandCtx | undefined>(undefined);

export const ProvidersMap = {
  Store: StoreContext.Provider,
  Cart: CartContext.Provider,
  User: UserContext.Provider,
  Brand: BrandContext.Provider,
};

export function useStore() {
  const v = useContext(StoreContext);
  if (!v) throw new Error('useStore must be used within Providers');
  return v;
}
export function useCart() {
  const v = useContext(CartContext);
  if (!v) throw new Error('useCart must be used within Providers');
  return v;
}
export function useUser() {
  const v = useContext(UserContext);
  if (!v) throw new Error('useUser must be used within Providers');
  return v;
}
export function useBrand() {
  const v = useContext(BrandContext);
  if (!v) throw new Error('useBrand must be used within Providers');
  return v;
}

export function useShallowMemo<T extends Record<string, any>>(obj: T) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => obj, Object.values(obj));
}

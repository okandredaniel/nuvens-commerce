import { createContext, useContext, useMemo } from 'react';
import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { resolvePolicyPath as resolvePolicyPathPure } from '~/lib/routing/paths';

type StoreCtx = {
  publicStoreDomain?: string;
  primaryDomainUrl?: string;
  footer?: Promise<FooterQuery | null> | null;
  header?: HeaderQuery | null;
  routing?: {
    isAllowed?: (path: string) => boolean;
    resolvePolicyPath?: (path: string) => string;
    recommendedFallback?: string;
    candidates?: string[];
  };
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
  return useMemo(() => obj, Object.values(obj));
}

function pickFirstAllowed(candidates: string[], isAllowed: (p: string) => boolean) {
  for (const p of candidates) if (isAllowed(p)) return p;
  return '/';
}

export function useRoutingPolicy(
  candidates: string[] = ['/', '/collections', '/pages', '/policies'],
) {
  const store = useStore();
  const provided = store.routing;
  const isAllowed = provided?.isAllowed ?? (() => true);
  const resolvePolicyPath =
    provided?.resolvePolicyPath ?? ((p: string) => resolvePolicyPathPure(p));
  const list = provided?.candidates ?? candidates;
  const recommended = provided?.recommendedFallback ?? pickFirstAllowed(list, isAllowed);
  return {
    isAllowed,
    resolvePolicyPath,
    recommendedFallback: recommended,
  };
}

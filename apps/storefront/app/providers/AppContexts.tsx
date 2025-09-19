import { resolvePolicyPath as resolvePolicyPathPure } from '@/lib/routing/paths';
import { createContext, useContext, useMemo, useRef } from 'react';
import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from 'storefrontapi.generated';

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

export function useShallowMemo<T extends Record<string, any>>(obj: T): T {
  const ref = useRef<T>(obj);
  const prev = ref.current;
  const prevKeys = Object.keys(prev);
  const keys = Object.keys(obj);
  let same = prevKeys.length === keys.length;
  if (same) {
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i] as keyof T;
      if (prev[k] !== obj[k]) {
        same = false;
        break;
      }
    }
  }
  if (!same) ref.current = obj;
  return same ? prev : obj;
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

  const isAllowed = useMemo<(path: string) => boolean>(
    () => provided?.isAllowed ?? (() => true),
    [provided?.isAllowed],
  );

  const resolvePolicyPath = useMemo<(path: string) => string>(
    () => provided?.resolvePolicyPath ?? ((p: string) => resolvePolicyPathPure(p)),
    [provided?.resolvePolicyPath],
  );

  const list = useMemo<string[]>(
    () => provided?.candidates ?? candidates,
    [provided?.candidates, candidates],
  );

  const recommended = useMemo(
    () => provided?.recommendedFallback ?? pickFirstAllowed(list, isAllowed),
    [provided?.recommendedFallback, list, isAllowed],
  );

  return {
    isAllowed,
    resolvePolicyPath,
    recommendedFallback: recommended,
  };
}

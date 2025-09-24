import { resolvePolicyPath as resolvePolicyPathPure } from '@/lib/routing/paths';
import type { BrandCtx, StoreCtx, UserCtx } from '@nuvens/core';
import type { CartApiQueryFragment, FooterQuery, HeaderQuery } from '@nuvens/shopify';
import { createContext, useContext, useMemo, useRef } from 'react';

const g = globalThis as any;

const StoreContext: React.Context<StoreCtx<HeaderQuery, FooterQuery> | undefined> =
  g.__StoreContext ??
  (g.__StoreContext = createContext<StoreCtx<HeaderQuery, FooterQuery> | undefined>(undefined));

const CartContext: React.Context<Promise<CartApiQueryFragment | null> | null | undefined> =
  g.__CartContext ??
  (g.__CartContext = createContext<Promise<CartApiQueryFragment | null> | null | undefined>(
    undefined,
  ));

const UserContext: React.Context<UserCtx | undefined> =
  g.__UserContext ?? (g.__UserContext = createContext<UserCtx | undefined>(undefined));

const BrandContext: React.Context<BrandCtx | undefined> =
  g.__BrandContext ?? (g.__BrandContext = createContext<BrandCtx | undefined>(undefined));

export const ProvidersMap = {
  Store: StoreContext.Provider,
  Cart: CartContext.Provider,
  User: UserContext.Provider,
  Brand: BrandContext.Provider,
};

export function useStore() {
  const v = useContext(StoreContext);
  if (v === undefined) throw new Error('useStore must be used within Providers');
  return v;
}
export function useCart() {
  const v = useContext(CartContext);
  if (v === undefined) throw new Error('useCart must be used within Providers');
  return v;
}
export function useCartMaybe() {
  return useContext(CartContext);
}
export function useUser() {
  const v = useContext(UserContext);
  if (v === undefined) throw new Error('useUser must be used within Providers');
  return v;
}
export function useBrand() {
  const v = useContext(BrandContext);
  if (v === undefined) throw new Error('useBrand must be used within Providers');
  return v;
}

export function useShallowMemo<T extends Record<string, unknown>>(obj: T): T {
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

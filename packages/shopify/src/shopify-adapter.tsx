import type { CoreAdapter, StoreCtx } from '@nuvens/core';
import type { OptimisticCart } from '@shopify/hydrogen';
import type { SelectedOption } from '@shopify/hydrogen/storefront-api-types';
import type { ElementType, ReactNode } from 'react';
import { Fragment, createContext, useContext } from 'react';
import type { To } from 'react-router';

export type ShopifyAdapter = CoreAdapter & {
  Brand: ElementType;
  defaultLocale: string;
  locales: string[];
  useCart: () => OptimisticCart<any>;
  useCartMaybe?: () => OptimisticCart<any> | null | undefined;
  useLocalizedHref: () => (value: To) => To;
  useStore: () => StoreCtx<any, any>;
  useVariantUrl: (handle: string, selectedOptions?: SelectedOption[]) => string;
};

const DefaultBrand: ElementType = ({ children }: { children?: ReactNode }) => (
  <Fragment>{children}</Fragment>
);

function defaultVariantUrl(handle: string, selectedOptions: SelectedOption[] = []) {
  const url = new URL(`/products/${handle}`, 'http://x');
  for (const { name, value } of selectedOptions) {
    if (name && value) url.searchParams.set(name, value);
  }
  return `${url.pathname}${url.search}`;
}

const defaults: Required<
  Pick<
    ShopifyAdapter,
    | 'Brand'
    | 'defaultLocale'
    | 'locales'
    | 'useCart'
    | 'useLocalizedHref'
    | 'useStore'
    | 'useVariantUrl'
  >
> & { useCartMaybe?: ShopifyAdapter['useCartMaybe'] } = {
  Brand: DefaultBrand,
  defaultLocale: 'en',
  locales: ['en'],
  useCart: () => ({}) as OptimisticCart<any>,
  useCartMaybe: () => undefined,
  useLocalizedHref: () => (v: To) => v,
  useStore: () => ({}) as any,
  useVariantUrl: defaultVariantUrl,
};

let registry: Partial<ShopifyAdapter> = {};

export function setShopifyAdapter(partial: Partial<ShopifyAdapter>) {
  const defined = Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined));
  registry = { ...registry, ...defined };
}

export function getShopifyAdapter(): Partial<ShopifyAdapter> {
  return registry;
}

const Ctx = createContext<Partial<ShopifyAdapter> | null>(null);

export function ShopifyAdapterProvider({
  value,
  children,
}: {
  value: Partial<ShopifyAdapter>;
  children: ReactNode;
}) {
  const defined = Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined));
  const merged = { ...getShopifyAdapter(), ...defined };
  return <Ctx.Provider value={merged}>{children}</Ctx.Provider>;
}

export function useShopifyAdapter(): Required<
  Pick<
    ShopifyAdapter,
    | 'Brand'
    | 'defaultLocale'
    | 'locales'
    | 'useCart'
    | 'useLocalizedHref'
    | 'useStore'
    | 'useVariantUrl'
  >
> &
  Partial<ShopifyAdapter> {
  const ctx = useContext(Ctx) ?? getShopifyAdapter();
  return {
    ...defaults,
    ...ctx,
  };
}

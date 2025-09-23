import { useLocalizedHref } from '@/hooks/useLocalizedHref';
import { useVariantUrl } from '@/lib/variants';
import { useCart, useCartMaybe, useStore } from '@/providers/AppContexts';
import { Brand, brandDefaultLocale, brandLocales } from '@nuvens/brand-ui';
import { setCoreAdapter } from '@nuvens/core';
import { LocalizedLink, LocalizedNavLink, setShopifyAdapter } from '@nuvens/shopify';

export function registerUiCoreAdapter() {
  setCoreAdapter({
    Link: LocalizedLink as any,
    NavLink: LocalizedNavLink as any,
  });
}

export function registerShopifyAdapter() {
  setShopifyAdapter({
    useStore,
    Brand,
    useCart,
    useCartMaybe,
    useVariantUrl,
    useLocalizedHref,
    defaultLocale: brandDefaultLocale,
    locales: brandLocales,
  });
}

import type { GalleryImage } from '@nuvens/core';
import { isValidImage } from '@nuvens/core';

export function shopifyProductToImages(product: any): GalleryImage[] {
  const fromImages: GalleryImage[] =
    product?.images?.nodes
      ?.map?.((n: any) => ({
        id: n?.id ?? null,
        url: n?.url ?? n?.src ?? '',
        altText: n?.altText ?? n?.alt ?? null,
      }))
      ?.filter(isValidImage) ?? [];

  const fromMedia: GalleryImage[] =
    product?.media?.nodes
      ?.map?.((m: any) =>
        m?.__typename === 'MediaImage'
          ? {
              id: m?.image?.id ?? null,
              url: m?.image?.url ?? m?.image?.src ?? '',
              altText: m?.image?.altText ?? m?.image?.alt ?? null,
            }
          : null,
      )
      ?.filter(isValidImage) ?? [];

  const seen = new Set<string>();
  const out: GalleryImage[] = [];
  for (const it of [...fromMedia, ...fromImages]) {
    const key = String(it.id ?? it.url ?? '');
    if (!seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  }
  return out;
}

export function shopifyVariantImage(variant: any): GalleryImage | null {
  const v = variant?.image;
  if (!v) return null;
  const g: GalleryImage = {
    id: v?.id ?? null,
    url: v?.url ?? v?.src ?? '',
    altText: v?.altText ?? v?.alt ?? null,
  };
  return isValidImage(g) ? g : null;
}

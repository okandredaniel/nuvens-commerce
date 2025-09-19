import type { GalleryImage } from '../interfaces/gallery.interface';

export function isValidImage(img?: GalleryImage | null): img is GalleryImage {
  return !!img && typeof img.url === 'string' && img.url.length > 0;
}

export function uniqueBy<T>(arr: T[], getKey: (t: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of arr) {
    const key = getKey(it);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  }
  return out;
}

export function ensureVariantFirst(base: GalleryImage[], variant?: GalleryImage | null) {
  if (!variant || !isValidImage(variant)) return base;
  const exists = base.find((i) => i.id === variant.id || i.url === variant.url);
  return exists
    ? base
    : uniqueBy<GalleryImage>([variant, ...base], (img) => String(img.id ?? img.url ?? ''));
}

export const brands = ['cosmos', 'naturalex', 'wooly', 'zippex'] as const;
export type BrandId = (typeof brands)[number];

export const isBrandId = (v: string): v is BrandId => (brands as readonly string[]).includes(v);

export function assertBrandId(v: unknown): BrandId {
  if (typeof v === 'string' && isBrandId(v)) return v;
  throw new Error('Invalid BRAND_ID');
}

export const brands = ['cosmos', 'naturalex', 'wooly', 'zippex'] as const;
export type BrandId = (typeof brands)[number];

import type { BrandId, DesignTokens } from '../types/tokens.interface';

const registry: Partial<Record<BrandId, DesignTokens>> = {};

export function registerBrandTokens(id: BrandId, tokens: DesignTokens) {
  registry[id] = tokens;
}

export function getBrandTokensById(id: BrandId): DesignTokens {
  const t = registry[id];
  if (!t) throw new Error('No brand found for the given BRAND_ID');
  return t;
}

export { registry };

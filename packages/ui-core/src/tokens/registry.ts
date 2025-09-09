import type { BrandId, TokensInterface } from '../types/tokens.interface';

const registry: Partial<Record<BrandId, TokensInterface>> = {};

export function registerBrandTokens(id: BrandId, tokens: TokensInterface) {
  registry[id] = tokens;
}

export function getBrandTokensById(id: BrandId): TokensInterface {
  const t = registry[id];
  if (!t) throw new Error('No brand found for the given BRAND_ID');
  return t;
}

export { registry };

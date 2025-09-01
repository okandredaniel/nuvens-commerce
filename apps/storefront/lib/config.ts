import { getBrandTokensById } from '@nuvens/brand-tokens';

export function getBrandPreset(id?: string) {
  if (!id) {
    throw new Error('BRAND_ID is invalid or missing');
  }
  const tokens = getBrandTokensById(id);
  return { id, tokens };
}

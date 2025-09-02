import { getBrandTokensById } from '@nuvens/brand-tokens';

export function getBrandPreset(id?: string) {
  if (!id) {
    throw new Error('BRAND_ID is invalid or missing');
  }

  const tokens = getBrandTokensById(id);

  if (!tokens) {
    throw new Error('No brand found for the given BRAND_ID');
  }

  return { id, tokens };
}

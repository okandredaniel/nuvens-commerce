import cosmos from './themes/cosmos';
import naturalex from './themes/naturalex';
import wooly from './themes/wooly';
import zippex from './themes/zippex';
import { BrandId, TokensInterface } from './types/tokens.interface';

const registry: Record<BrandId, TokensInterface> = {
  cosmos,
  naturalex,
  wooly,
  zippex,
};

export function getBrandTokensById(id: string) {
  return registry[id as BrandId];
}

export * from './types/tokens.interface';

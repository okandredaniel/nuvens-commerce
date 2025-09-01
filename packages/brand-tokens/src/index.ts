import cosmos from './themes/cosmos';
import naturalex from './themes/naturalex';
import wooly from './themes/wooly';
import zippex from './themes/zippex';

const registry = {
  cosmos,
  naturalex,
  wooly,
  zippex,
};

export function getBrandTokensById(id: string) {
  return registry[id as keyof typeof registry];
}

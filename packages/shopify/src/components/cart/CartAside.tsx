import { Aside } from '@nuvens/ui';
import { type OptimisticCart } from '@shopify/hydrogen';
import { type CartApiQueryFragment } from '../../types/storefrontapi.generated';
import { CartMain } from './CartMain';

type Props = {
  cart: OptimisticCart<CartApiQueryFragment>;
  heading: string;
  fallback: string;
};

export function CartAside({ cart, heading, fallback }: Props) {
  if (!cart) return null;

  const key = cart?.id ? `${cart.id}:${cart.updatedAt ?? cart.totalQuantity ?? 0}` : 'empty';

  return (
    <Aside type="cart" heading={heading}>
      <CartMain key={key} cart={cart} layout="aside" fallback={fallback} />
    </Aside>
  );
}

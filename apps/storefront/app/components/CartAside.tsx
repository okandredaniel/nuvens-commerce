import { Suspense } from 'react';
import { Await } from 'react-router';
import { CartApiQueryFragment } from 'storefrontapi.generated';
import { Aside } from './Aside';
import { CartMain } from './CartMain';

type CartPromise = Promise<CartApiQueryFragment | null>;

export function CartAside({ cart }: { cart: CartPromise }) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

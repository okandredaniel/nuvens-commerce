import { Suspense } from 'react';
import { Await } from 'react-router';
import { Aside } from './Aside';
import { CartMain } from './CartMain';
import { PageLayoutProps } from './PageLayout';

export function CartAside({ cart }: { cart: PageLayoutProps['cart'] }) {
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

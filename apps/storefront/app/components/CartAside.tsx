import { Aside } from '@nuvens/ui-core';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Await } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartMain } from './CartMain';

type CartPromise = Promise<CartApiQueryFragment | null>;

export function CartAside({ cart }: { cart: CartPromise }) {
  const { t: tCart } = useTranslation('cart');
  const { t: tCommon } = useTranslation('common');

  return (
    <Aside type="cart" heading={tCart('title')}>
      <Suspense fallback={<p className="px-4 py-6 text-sm opacity-70">{tCommon('loading')}</p>}>
        <Await resolve={cart}>{(resolved) => <CartMain cart={resolved} layout="aside" />}</Await>
      </Suspense>
    </Aside>
  );
}

import { Aside } from '@nuvens/ui-core';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Await } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useCart } from '~/providers';
import { CartMain } from './CartMain';

export function CartAside() {
  const { t: tCart } = useTranslation('cart');
  const { t: tCommon } = useTranslation('common');
  const { cart } = useCart();
  if (!cart) return null;

  return (
    <Aside type="cart" heading={tCart('title')}>
      <Suspense
        fallback={<p className="px-4 py-6 text-sm opacity-70">{tCommon('status.loading')}</p>}
      >
        <Await resolve={cart}>
          {(resolved: CartApiQueryFragment | null) => <CartMain cart={resolved} layout="aside" />}
        </Await>
      </Suspense>
    </Aside>
  );
}

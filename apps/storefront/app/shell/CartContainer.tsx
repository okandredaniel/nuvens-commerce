import { useCart, useRoutingPolicy } from '@/providers/AppContexts';
import { CartAside } from '@nuvens/shopify';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Await } from 'react-router';

export function CartContainer() {
  const { t } = useTranslation('cart');
  const cartPromise = useCart() as any;
  const { recommendedFallback } = useRoutingPolicy();

  if (!cartPromise || typeof cartPromise.then !== 'function') {
    return (
      <CartAside heading={t('title')} cart={cartPromise ?? null} fallback={recommendedFallback} />
    );
  }

  return (
    <Suspense
      fallback={
        <CartAside heading={t('title')} cart={null as any} fallback={recommendedFallback} />
      }
    >
      <Await resolve={cartPromise}>
        {(cart: any) => (
          <CartAside heading={t('title')} cart={cart} fallback={recommendedFallback} />
        )}
      </Await>
    </Suspense>
  );
}

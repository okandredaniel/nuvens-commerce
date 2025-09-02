import { type CartViewPayload, useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import { Suspense } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { Await, useAsyncValue } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import type { HeaderProps } from './header.interfaces';

export function CartButton({ cart, ring }: { cart: HeaderProps['cart']; ring: string }) {
  return (
    <Suspense fallback={<CartBadge count={null} ring={ring} />}>
      <Await resolve={cart}>
        <CartResolved ring={ring} />
      </Await>
    </Suspense>
  );
}

function CartResolved({ ring }: { ring: string }) {
  const original = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(original);
  return <CartBadge count={cart?.totalQuantity ?? 0} ring={ring} />;
}

function CartBadge({ count, ring }: { count: number | null; ring: string }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();

  return (
    <button
      aria-label="Open cart"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative inline-grid place-items-center size-10 rounded-full"
      style={{ border: `2px solid ${ring}` }}
    >
      <FiShoppingCart className="text-black size-5" />
      {typeof count === 'number' ? (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-white/90 text-black text-[10px] font-semibold grid place-items-center">
          {count}
        </span>
      ) : null}
    </button>
  );
}

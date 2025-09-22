import { useCart } from '@/providers/AppContexts';
import { Badge, Button, Tooltip, useAside } from '@nuvens/ui';
import { type CartViewPayload, useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import { ShoppingCart } from 'lucide-react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Await, useAsyncValue } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

export function CartButton() {
  const { cart: cartPromise } = useCart();
  if (!cartPromise) return <CartBadge count={null} />;
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cartPromise}>
        <CartResolved />
      </Await>
    </Suspense>
  );
}

function CartResolved() {
  const original = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(original);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function CartBadge({ count }: { count: number | null }) {
  const { open } = useAside();
  const { publish, shop, cart, prevCart } = useAnalytics();
  const { t } = useTranslation('common');
  const label = t('nav.cart');
  const openLabel = t('nav.openCart');

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button
          aria-label={openLabel}
          variant="outline"
          surface="dark"
          onClick={(e) => {
            e.preventDefault();
            open('cart');
            publish('cart_viewed', {
              cart,
              prevCart,
              shop,
              url: typeof window !== 'undefined' ? window.location.href : '',
            } as CartViewPayload);
          }}
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {typeof count === 'number' && count > 0 ? (
              <Badge className="absolute -top-4 -right-6 min-w-[1.25rem] h-5 px-1.5 text-[10px] leading-5 text-center">
                {count}
              </Badge>
            ) : null}
          </div>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content sideOffset={8}>
        {label}
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

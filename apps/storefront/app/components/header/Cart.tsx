import { useCart } from '@/providers/AppContexts';
import { Badge, IconButton, useAside } from '@nuvens/ui';
import * as Tooltip from '@radix-ui/react-tooltip';
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
    <Tooltip.Root delayDuration={150}>
      <Tooltip.Trigger asChild>
        <IconButton
          aria-label={openLabel}
          title={openLabel}
          variant="outline"
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
              <Badge className="absolute -top-3 -right-3 min-w-[1.25rem] h-5 px-1.5 text-[10px] leading-5 text-center">
                {count}
              </Badge>
            ) : null}
          </div>
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        sideOffset={8}
        className="z-50 rounded-lg bg-[color:var(--color-popover)] px-2 py-1 text-xs text-[color:var(--color-on-popover)] shadow-md"
      >
        {label}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

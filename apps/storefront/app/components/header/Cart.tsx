import { Badge, IconButton, useAside } from '@nuvens/ui-core';
import * as Tooltip from '@radix-ui/react-tooltip';
import { type CartViewPayload, useAnalytics, useOptimisticCart } from '@shopify/hydrogen';
import { ShoppingCart } from 'lucide-react';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Await, useAsyncValue } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';

type Props = { cart: Promise<CartApiQueryFragment | null> };

export function CartButton({ cart }: Props) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
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
          variant="outline"
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
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {typeof count === 'number' ? (
              <Badge className="absolute -top-4 -right-4">{count}</Badge>
            ) : null}
          </div>
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        sideOffset={8}
        className="z-50 rounded-lg bg-[color:var(--color-popover)] text-[color:var(--color-on-popover)] px-2 py-1 text-xs shadow-md"
      >
        {label}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

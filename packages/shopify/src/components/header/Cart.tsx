import { Badge, Button, Tooltip, useAside } from '@nuvens/ui';
import type { CartViewPayload } from '@shopify/hydrogen';
import { useAnalytics } from '@shopify/hydrogen';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShopifyAdapter } from '../../shopify-adapter';

function isPromiseLike(x: unknown): x is Promise<any> {
  return !!x && typeof (x as any).then === 'function';
}

export function CartButton() {
  const { useCartMaybe } = useShopifyAdapter();
  const original = useCartMaybe!();
  const [resolved, setResolved] = useState<any>(() => (isPromiseLike(original) ? null : original));

  useEffect(() => {
    if (isPromiseLike(original)) {
      let active = true;
      original.then((c: any) => {
        if (active) setResolved(c ?? null);
      });
      return () => {
        active = false;
      };
    } else {
      setResolved(original ?? null);
    }
  }, [original]);

  const { open } = useAside();
  const { publish, shop, cart: analyticsCart, prevCart } = useAnalytics();
  const { t } = useTranslation('common');
  const label = t('nav.cart');
  const openLabel = t('nav.openCart');
  const qty = resolved?.totalQuantity || 0;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button
          aria-label={openLabel}
          variant="outline"
          surface="dark"
          className="w-full max-w-12 md:max-w-none"
          icon={true}
          onClick={(e) => {
            e.preventDefault();
            open('cart');
            publish('cart_viewed', {
              cart: analyticsCart,
              prevCart,
              shop,
              url: typeof window !== 'undefined' ? window.location.href : '',
            } as CartViewPayload);
          }}
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {!!qty && (
              <Badge className="absolute -top-4 -right-4 min-w-[1.25rem] h-5 px-1.5 text-[10px] leading-5 text-center">
                {qty}
              </Badge>
            )}
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

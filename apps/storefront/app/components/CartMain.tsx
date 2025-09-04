import { Button } from '@nuvens/ui-core';
import { useOptimisticCart } from '@shopify/hydrogen';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartLineItem } from '~/components/CartLineItem';
import { RootLoader } from '~/root';
import { CartEmpty } from './CartEmpty';
import { CartSummary, DiscountBox, GiftCardBox } from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

function decodeCartToken(gid?: string) {
  if (!gid) return '';
  try {
    return atob(gid).split('/').pop() || '';
  } catch {
    return '';
  }
}

export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const items = cart?.lines?.nodes ?? [];
  const hasItems = (cart?.totalQuantity || 0) > 0;
  const shell =
    'rounded-2xl border border-[color:var(--color-border,#e5e7eb)] bg-[color:var(--color-surface,#fff)]';

  if (!hasItems) return <CartEmpty />;

  return (
    <div className={layout === 'page' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : 'space-y-5'}>
      <section className={layout === 'page' ? 'lg:col-span-2' : ''} aria-labelledby="cart-lines">
        <ul
          className={`divide-y divide-[color:var(--color-border,#e5e7eb)] ${shell}`}
          aria-live="polite"
        >
          {items.map((line) => (
            <li key={line.id} className="p-4 sm:p-5">
              <CartLineItem line={line} layout={layout} />
            </li>
          ))}
        </ul>
      </section>

      <aside className={layout === 'page' ? 'lg:col-span-1 space-y-4' : 'space-y-4'}>
        <CartSummary cart={cart} layout={layout} />
        <DiscountBox codes={cart?.discountCodes} />
        <GiftCardBox giftCards={cart?.appliedGiftCards} />
        {cart?.checkoutUrl ? (
          <CheckoutActions href={cart.checkoutUrl} />
        ) : (
          <CheckoutActions cartId={cart?.id as string | undefined} />
        )}
      </aside>
    </div>
  );
}

function CheckoutActions({ href, cartId }: { href?: string; cartId?: string }) {
  const { t } = useTranslation('cart');
  const data = useRouteLoaderData<RootLoader>('root');
  const checkoutDomain = data?.consent?.checkoutDomain || data?.publicStoreDomain;

  const fallback =
    !href && cartId && checkoutDomain
      ? `https://${checkoutDomain}/cart/c/${decodeCartToken(cartId)}`
      : undefined;

  const url = href || fallback;
  if (!url) return null;

  return (
    <div className="rounded-2xl border border-[color:var(--color-border,#e5e7eb)] bg-[color:var(--color-surface,#fff)] p-4 sm:p-5">
      <Button asChild className="w-full">
        <a href={url}>{t('summary.checkout', 'Continue to checkout')}</a>
      </Button>
    </div>
  );
}

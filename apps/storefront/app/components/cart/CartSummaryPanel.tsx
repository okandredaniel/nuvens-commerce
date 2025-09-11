import { Button } from '@nuvens/ui';
import type { OptimisticCart } from '@shopify/hydrogen';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { RootLoader } from '~/root';
import { CartSummary, DiscountBox, GiftCardBox } from '.';

type Props = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout?: 'page' | 'aside';
};

function decodeCartToken(gid?: string) {
  if (!gid) return '';
  try {
    return atob(gid).split('/').pop() || '';
  } catch {
    return '';
  }
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
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 sm:p-5">
      <Button asChild className="w-full">
        <a href={url}>{t('checkout.cta')}</a>
      </Button>
    </div>
  );
}

export function CartSummaryPanel({ cart, layout = 'aside' }: Props) {
  return (
    <div className="space-y-4">
      <CartSummary cart={cart} layout={layout} />
      <DiscountBox codes={cart.discountCodes} />
      <GiftCardBox giftCards={cart.appliedGiftCards} />
      <CheckoutActions
        href={cart.checkoutUrl ?? undefined}
        cartId={cart.id as string | undefined}
      />
    </div>
  );
}

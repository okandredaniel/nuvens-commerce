import { Money, type OptimisticCart } from '@shopify/hydrogen';
import { useTranslation } from 'react-i18next';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartLayout } from '.';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart }: CartSummaryProps) {
  const { t } = useTranslation('cart');

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 sm:p-5">
      <h4 className="text-base font-semibold">{t('summary.title')}</h4>
      <dl className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <dt className="opacity-70">{t('summary.subtotal')}</dt>
          <dd className="font-medium">
            {cart.cost?.subtotalAmount?.amount ? <Money data={cart.cost?.subtotalAmount} /> : '-'}
          </dd>
        </div>
      </dl>
    </div>
  );
}

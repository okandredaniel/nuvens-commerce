import { Card, CardContent } from '@nuvens/ui';
import { Money, type OptimisticCart } from '@shopify/hydrogen';
import { useTranslation } from 'react-i18next';
import { type CartApiQueryFragment } from '../../types/storefrontapi.generated';
import type { CartLayout } from './cart.interface';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment>;
  layout: CartLayout;
};

export function CartSummary({ cart }: CartSummaryProps) {
  const { t } = useTranslation('cart');

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <h4 className="text-base font-semibold text-neutral-900">{t('summary.title')}</h4>
        <dl className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <dt className="opacity-70">{t('summary.subtotal')}</dt>
            <dd className="font-medium">
              {cart.cost?.subtotalAmount?.amount ? <Money data={cart.cost?.subtotalAmount} /> : '-'}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

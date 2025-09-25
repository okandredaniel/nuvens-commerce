import { cn } from '@nuvens/ui';
import { type OptimisticCart } from '@shopify/hydrogen';
import { useTranslation } from 'react-i18next';
import type { CartLayout } from '../../types/cart.interface';
import { type CartApiQueryFragment } from '../../types/storefrontapi.generated';
import { CartEmpty } from './CartEmpty';
import { CartLineItem } from './CartLineItem';
import { CartSummaryPanel } from './CartSummaryPanel';

type Props = {
  cart: OptimisticCart<CartApiQueryFragment>;
  layout: CartLayout;
  fallback: string;
};

export function CartMain({ layout, cart, fallback }: Props) {
  const { t } = useTranslation('cart');

  if (!cart) return null;

  const items = cart?.lines?.nodes ?? [];
  const hasItems = (cart?.totalQuantity ?? 0) > 0;

  if (!hasItems) return <CartEmpty fallback={fallback} />;

  const isPage = layout === 'page';

  return (
    <div className={cn(isPage ? 'grid grid-cols-1 gap-6 lg:grid-cols-3' : 'space-y-5')}>
      <section className={cn(isPage && 'lg:col-span-2')} aria-live="polite">
        <h2 id="cart-lines" className="sr-only">
          {t('aria-title')}
        </h2>
        <ul
          className={cn(
            'rounded-xl border border-neutral-200 bg-neutral-0',
            'divide-y divide-neutral-200',
          )}
          aria-labelledby="cart-lines"
        >
          {items.map((line: any) => (
            <li key={line.id} className="p-4 sm:p-5">
              <CartLineItem line={line} layout={layout} />
            </li>
          ))}
        </ul>
      </section>

      <aside className={cn(isPage && 'lg:col-span-1')}>
        <CartSummaryPanel cart={cart} layout={layout} />
      </aside>
    </div>
  );
}

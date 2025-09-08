import { cn } from '@nuvens/ui-core';
import { useOptimisticCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartLayout, CartLineItem } from '.';
import { CartEmpty } from './CartEmpty';
import { CartSummaryPanel } from './CartSummaryPanel';

type Props = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({ layout, cart: originalCart }: Props) {
  const cart = useOptimisticCart(originalCart);
  const items = cart?.lines?.nodes ?? [];
  const hasItems = (cart?.totalQuantity ?? 0) > 0;

  if (!hasItems) return <CartEmpty />;

  const isPage = layout === 'page';

  return (
    <div className={cn(isPage ? 'grid grid-cols-1 gap-6 lg:grid-cols-3' : 'space-y-5')}>
      <section
        className={cn(isPage && 'lg:col-span-2')}
        aria-labelledby="cart-lines"
        aria-live="polite"
      >
        <ul
          className={cn(
            'divide-y divide-[color:var(--color-border)]',
            'rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]',
          )}
        >
          {items.map((line) => (
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

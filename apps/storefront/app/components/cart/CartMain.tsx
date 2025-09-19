import { cn } from '@nuvens/ui';
import { useOptimisticCart } from '@shopify/hydrogen';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from './cart.interface';
import { CartEmpty } from './CartEmpty';
import { CartLineItem } from './CartLineItem';
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
      <section className={cn(isPage && 'lg:col-span-2')} aria-live="polite">
        <h2 id="cart-lines" className="sr-only">
          Cart items
        </h2>
        <ul
          className={cn(
            'rounded-xl border border-neutral-200 bg-neutral-0',
            'divide-y divide-neutral-200',
          )}
          aria-labelledby="cart-lines"
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

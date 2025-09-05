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
  const hasItems = (cart?.totalQuantity || 0) > 0;
  const shell =
    'rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]';

  if (!hasItems) return <CartEmpty />;

  return (
    <div className={layout === 'page' ? 'grid grid-cols-1 gap-6 lg:grid-cols-3' : 'space-y-5'}>
      <section className={layout === 'page' ? 'lg:col-span-2' : ''} aria-labelledby="cart-lines">
        <ul className={`divide-y divide-[color:var(--color-border)] ${shell}`} aria-live="polite">
          {items.map((line) => (
            <li key={line.id} className="p-4 sm:p-5">
              <CartLineItem line={line} layout={layout} />
            </li>
          ))}
        </ul>
      </section>

      <aside className={layout === 'page' ? 'lg:col-span-1' : ''}>
        <CartSummaryPanel cart={cart} layout={layout} />
      </aside>
    </div>
  );
}

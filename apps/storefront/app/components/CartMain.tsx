import { useOptimisticCart } from '@shopify/hydrogen';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useAside } from '~/components/Aside';
import { CartLineItem } from '~/components/CartLineItem';
import { CartSummary } from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({ layout, cart: originalCart }: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart && Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({ hidden = false }: { hidden: boolean; layout?: CartMainProps['layout'] }) {
  const { close } = useAside();
  const { t } = useTranslation('cart');
  const { pathname } = useLocation();
  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const prefix = /^[A-Za-z]{2}-[A-Za-z]{2}$/.test(seg) ? `/${seg.toLowerCase()}` : '';
  const to = `${prefix}/collections`;

  return (
    <div hidden={hidden}>
      <br />
      <p>{t('emptyMessage')}</p>
      <br />
      <Link to={to} onClick={close} prefetch="viewport">
        {t('continueShopping')}
      </Link>
    </div>
  );
}

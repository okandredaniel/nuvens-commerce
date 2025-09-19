import { CartForm } from '@shopify/hydrogen';
import * as React from 'react';
import type { FetcherWithComponents } from 'react-router';

export function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode | ((fetcher: FetcherWithComponents<any>) => React.ReactNode);
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {(fetcher) => (typeof children === 'function' ? children(fetcher) : children)}
    </CartForm>
  );
}

export function UpdateGiftCardForm({
  clear,
  children,
}: {
  clear?: boolean;
  children:
    | ((state: { lastEntered?: string }, fetcher: FetcherWithComponents<any>) => React.ReactNode)
    | React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode') as string | undefined;
        const ui =
          typeof children === 'function' ? children({ lastEntered: code }, fetcher) : children;
        return clear ? (
          <>
            <input type="hidden" name="giftCardCode" value="" />
            {ui}
          </>
        ) : (
          ui
        );
      }}
    </CartForm>
  );
}

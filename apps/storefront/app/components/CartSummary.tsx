import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { CartForm, Money, type OptimisticCart } from '@shopify/hydrogen';
import { Button, Input } from '@nuvens/ui-core';
import { useTranslation } from 'react-i18next';

export type CartLayout = 'page' | 'aside';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({ cart }: CartSummaryProps) {
  const { t } = useTranslation('cart');
  return (
    <div className="rounded-2xl border border-[color:var(--color-border,#e5e7eb)] bg-[color:var(--color-surface,#fff)] p-4 sm:p-5">
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

export function DiscountBox({ codes }: { codes?: CartApiQueryFragment['discountCodes'] }) {
  const { t } = useTranslation('cart');
  const applied = codes?.filter((d) => d.applicable).map((d) => d.code) || [];
  return (
    <div className="rounded-2xl border border-[color:var(--color-border,#e5e7eb)] bg-[color:var(--color-surface,#fff)] p-4 sm:p-5">
      <div className="text-sm font-medium">{t('discount.title')}</div>
      {applied.length > 0 ? (
        <div className="mt-3 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-[color:var(--color-border,#e5e7eb)] px-3 py-2">
            <code className="opacity-80">{applied.join(', ')}</code>
            <UpdateDiscountForm>
              <Button type="submit" variant="ghost" size="sm">
                {t('discount.remove')}
              </Button>
            </UpdateDiscountForm>
          </div>
        </div>
      ) : null}
      <UpdateDiscountForm discountCodes={applied}>
        <form className="mt-3 flex items-center gap-2">
          <Input name="discountCode" placeholder={t('discount.placeholder')} />
          <Button type="submit" variant="outline">
            {t('discount.apply')}
          </Button>
        </form>
      </UpdateDiscountForm>
    </div>
  );
}

export function GiftCardBox({
  giftCards,
}: {
  giftCards: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const { t } = useTranslation('cart');
  return (
    <div className="rounded-2xl border border-[color:var(--color-border,#e5e7eb)] bg-[color:var(--color-surface,#fff)] p-4 sm:p-5">
      <div className="text-sm font-medium">{t('giftcard.title')}</div>
      <UpdateGiftCardForm>
        {(state) => (
          <form className="mt-3 flex items-center gap-2">
            <Input
              name="giftCardCode"
              defaultValue={state.lastEntered || ''}
              placeholder={t('giftcard.placeholder')}
            />
            <Button type="submit" variant="outline">
              {t('giftcard.apply')}
            </Button>
          </form>
        )}
      </UpdateGiftCardForm>
      {giftCards?.length ? (
        <div className="mt-3 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-[color:var(--color-border,#e5e7eb)] px-3 py-2">
            <code className="opacity-80">
              {giftCards.map((g) => `***${g.lastCharacters}`).join(', ')}
            </code>
            <UpdateGiftCardForm clear>
              <Button type="submit" variant="ghost" size="sm">
                {t('giftcard.remove')}
              </Button>
            </UpdateGiftCardForm>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{ discountCodes: discountCodes || [] }}
    >
      {children}
    </CartForm>
  );
}

function UpdateGiftCardForm({
  clear,
  children,
}: {
  clear?: boolean;
  children: ((state: { lastEntered?: string }) => React.ReactNode) | React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{ giftCardCodes: [] }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode') as string | undefined;
        const ui = typeof children === 'function' ? children({ lastEntered: code }) : children;
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

import { Button, Stepper, useAside } from '@nuvens/ui-core';
import { CartForm, Image, type OptimisticCartLine } from '@shopify/hydrogen';
import type { CartLineUpdateInput } from '@shopify/hydrogen/storefront-api-types';
import { Trash2 } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import type { CartLayout } from '~/components/CartMain';
import { useVariantUrl } from '~/lib/variants';
import { ProductPrice } from './ProductPrice';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({ layout, line }: { layout: CartLayout; line: CartLine }) {
  const { id, merchandise, cost, isOptimistic } = line;
  const { product, title, image, selectedOptions } = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const { close } = useAside();
  const { t } = useTranslation('cart');

  return (
    <li key={id} className="flex gap-4 sm:gap-5">
      {image ? (
        <Link
          to={lineItemUrl}
          prefetch="intent"
          onClick={() => layout === 'aside' && close()}
          aria-label={product.title}
          className="shrink-0"
        >
          <Image
            alt={title}
            data={image}
            aspectRatio="1/1"
            width={96}
            height={96}
            loading="lazy"
            className="h-24 w-24 rounded-xl object-cover"
          />
        </Link>
      ) : null}

      <div className="min-w-0 flex-1">
        <Link
          to={lineItemUrl}
          prefetch="intent"
          onClick={() => layout === 'aside' && close()}
          className="block"
        >
          <p className="truncate text-sm font-medium">{product.title}</p>
        </Link>

        <ProductPrice price={cost?.totalAmount} />

        {selectedOptions?.length ? (
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[color:var(--color-muted,#6b7280)]">
            {selectedOptions.map((o) => (
              <li key={o.name} className="truncate">
                <span className="opacity-70">{o.name}:</span> {o.value}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 flex items-center justify-between">
          <CartQuantityStepper line={line} />
          <RemoveLinesButton lineIds={[id]} disabled={!!isOptimistic} />
        </div>
      </div>
    </li>
  );
}

function CartQuantityStepper({ line }: { line: CartLine }) {
  const { t } = useTranslation('cart');
  if (!line || typeof line.quantity === 'undefined') return null;

  const { id: lineId, quantity = 1, isOptimistic } = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  const decBtnRef = useRef<HTMLButtonElement>(null);
  const incBtnRef = useRef<HTMLButtonElement>(null);

  const decreaseLabel = t('quantity.decrease');
  const increaseLabel = t('quantity.increase');

  return (
    <div className="flex items-center gap-2">
      <CartForm
        fetcherKey={getUpdateKey([lineId, 'dec'])}
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{ lines: [{ id: lineId, quantity: prevQuantity }] as CartLineUpdateInput[] }}
      >
        <button ref={decBtnRef} type="submit" className="hidden" aria-hidden />
      </CartForm>

      <CartForm
        fetcherKey={getUpdateKey([lineId, 'inc'])}
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{ lines: [{ id: lineId, quantity: nextQuantity }] as CartLineUpdateInput[] }}
      >
        <button ref={incBtnRef} type="submit" className="hidden" aria-hidden />
      </CartForm>

      <Stepper
        value={quantity}
        size="sm"
        decDisabled={quantity <= 1 || !!isOptimistic}
        incDisabled={!!isOptimistic}
        decreaseLabel={decreaseLabel}
        increaseLabel={increaseLabel}
        onDecrement={() => decBtnRef.current?.click()}
        onIncrement={() => incBtnRef.current?.click()}
      />
    </div>
  );
}

function RemoveLinesButton({ lineIds, disabled }: { lineIds: string[]; disabled: boolean }) {
  const { t } = useTranslation('cart');
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{ lineIds }}
    >
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        aria-label={t('remove')}
        disabled={disabled}
        className="text-[color:var(--color-danger,#dc2626)] hover:bg-[color:var(--color-danger,#dc2626)]/10"
      >
        <Trash2 className="mr-1 h-4 w-4" />
        {t('remove')}
      </Button>
    </CartForm>
  );
}

function getUpdateKey(parts: (string | number)[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...parts].join('-');
}

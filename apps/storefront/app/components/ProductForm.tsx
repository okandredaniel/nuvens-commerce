import { useAside } from '@nuvens/ui';
import * as Tooltip from '@radix-ui/react-tooltip';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type { Maybe, ProductOptionValueSwatch } from '@shopify/hydrogen/storefront-api-types';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import type { ProductFragment } from 'storefrontapi.generated';
import { LocalizedLink } from '~/components/LocalizedLink';
import { AddToCartButton } from './cart';

export function ProductForm({
  productOptions,
  selectedVariant,
  maxQty = 99,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  maxQty?: number;
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  const { t } = useTranslation('product');
  const [qty, setQty] = useState(1);

  function dec() {
    setQty((q) => Math.max(1, q - 1));
  }

  function inc() {
    setQty((q) => Math.min(maxQty, q + 1));
  }

  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <fieldset key={option.name} className="space-y-3">
            <legend className="text-sm font-medium">{option.name}</legend>

            <div className="flex flex-wrap gap-2" role="group" aria-label={option.name}>
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const base =
                  'inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]';
                const state = selected
                  ? 'border-[color:var(--color-on-surface)] ring-2 ring-[color:var(--color-on-surface)]/10'
                  : 'border-[color:var(--color-border)] hover:border-[color:var(--color-on-surface)]/30';
                const availability = available ? '' : 'opacity-40 cursor-not-allowed';
                const disabled = !exists;

                if (isDifferentProduct) {
                  return (
                    <Tooltip.Root key={option.name + name} delayDuration={150}>
                      <Tooltip.Trigger asChild>
                        <LocalizedLink
                          preventScrollReset
                          replace
                          to={`/products/${handle}?${variantUriQuery}`}
                          aria-current={selected ? 'true' : undefined}
                          aria-disabled={!available}
                          className={`${base} ${state} ${availability}`}
                        >
                          <ProductOptionSwatch swatch={swatch} />
                          {!swatch?.color && !swatch?.image ? (
                            <span className="ml-2">{name}</span>
                          ) : null}
                        </LocalizedLink>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          sideOffset={8}
                          className="z-50 rounded-md bg-[color:var(--color-popover)] px-2 py-1 text-xs text-[color:var(--color-on-popover)] shadow"
                        >
                          {name}
                          <Tooltip.Arrow className="fill-[color:var(--color-popover)]" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  );
                }

                return (
                  <Tooltip.Root key={option.name + name} delayDuration={150}>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        aria-pressed={selected}
                        disabled={disabled}
                        onClick={() => {
                          if (!selected) {
                            navigate(`?${variantUriQuery}`, {
                              replace: true,
                              preventScrollReset: true,
                            });
                          }
                        }}
                        className={`${base} ${state} ${availability}`}
                        aria-label={name}
                      >
                        <ProductOptionSwatch swatch={swatch} />
                        {!swatch?.color && !swatch?.image ? name : null}
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        sideOffset={8}
                        className="z-50 rounded-md bg-[color:var(--color-popover)] px-2 py-1 text-xs text-[color:var(--color-on-popover)] shadow"
                      >
                        {name}
                        <Tooltip.Arrow className="fill-[color:var(--color-popover)]" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div className="flex gap-3">
        <div className="flex items-center justify-center rounded-full p-1 border border-[color:var(--color-border)] bg-white">
          <button
            type="button"
            onClick={dec}
            aria-label={t('decrease') as string}
            className="w-11 h-11 flex items-center justify-center rounded-full text-sm leading-none hover:bg-black/5"
          >
            <Minus />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={maxQty}
            value={qty}
            onChange={(e) => {
              const v = parseInt(e.target.value || '1', 10);
              const clamped = isNaN(v) ? 1 : Math.min(maxQty, Math.max(1, v));
              setQty(clamped);
            }}
            className="w-full h-full sm:w-12 text-center text-sm outline-none bg-transparent appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label={t('quantity') as string}
          />
          <button
            type="button"
            onClick={inc}
            aria-label={t('increase') as string}
            className="w-11 h-11 flex items-center justify-center rounded-full text-sm leading-none hover:bg-black/5"
          >
            <Plus />
          </button>
        </div>

        <AddToCartButton
          ariaLabel={selectedVariant?.availableForSale ? t('addToCart') : t('soldOut')}
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: Math.min(qty, maxQty),
                    selectedVariant,
                  },
                ]
              : []
          }
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent('analytics:add_to_cart', {
                detail: { variantId: selectedVariant?.id, quantity: Math.min(qty, maxQty) },
              }),
            );
            open('cart');
          }}
        >
          {selectedVariant?.availableForSale ? t('addToCart') : t('soldOut')}
        </AddToCartButton>
      </div>
    </div>
  );
}

function ProductOptionSwatch({ swatch }: { swatch?: Maybe<ProductOptionValueSwatch> | undefined }) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;
  if (!image && !color) return null;

  return (
    <span
      aria-hidden
      className="h-5 w-5 overflow-hidden rounded-full ring-1 ring-black/10"
      style={{ backgroundColor: color || 'transparent' }}
    >
      {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
    </span>
  );
}

import { useAside } from '@nuvens/ui';
import * as Tooltip from '@radix-ui/react-tooltip';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type { Maybe, ProductOptionValueSwatch } from '@shopify/hydrogen/storefront-api-types';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import type { ProductFragment } from 'storefrontapi.generated';
import { AddToCartButton } from './cart';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const { open } = useAside();
  const { t } = useTranslation('product');

  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        if (option.optionValues.length === 1) return null;

        return (
          <fieldset key={option.name} className="space-y-3">
            <legend className="text-sm font-medium">{option.name}</legend>

            <div className="flex flex-wrap gap-2">
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
                  'inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm transition';
                const state = selected
                  ? 'border-black ring-2 ring-black/10'
                  : 'border-transparent hover:border-black/20';
                const availability = available ? '' : 'opacity-40 cursor-not-allowed';
                const disabled = !exists;

                if (isDifferentProduct) {
                  return (
                    <Tooltip.Root key={option.name + name}>
                      <Tooltip.Trigger asChild>
                        <Link
                          prefetch="intent"
                          preventScrollReset
                          replace
                          to={`/products/${handle}?${variantUriQuery}`}
                          aria-current={selected ? 'true' : undefined}
                          className={`${base} ${state} ${availability}`}
                          aria-disabled={!available}
                        >
                          <ProductOptionSwatch swatch={swatch} name={name} />
                          {!swatch?.color && !swatch?.image ? (
                            <span className="ml-2">{name}</span>
                          ) : null}
                        </Link>
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
                  <Tooltip.Root key={option.name + name}>
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
                        <ProductOptionSwatch swatch={swatch} name={name} />
                        {!swatch?.color && !swatch?.image ? (
                          <span className="ml-2">{name}</span>
                        ) : null}
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

      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => open('cart')}
        variant="primary"
        className="w-full"
        lines={
          selectedVariant
            ? [{ merchandiseId: selectedVariant.id, quantity: 1, selectedVariant }]
            : []
        }
        aria-label={selectedVariant?.availableForSale ? t('addToCart') : t('soldOut')}
      >
        {selectedVariant?.availableForSale ? t('addToCart') : t('soldOut')}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) {
    return <span className="truncate">{name}</span>;
  }

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

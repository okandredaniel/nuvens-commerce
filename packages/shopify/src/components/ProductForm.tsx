import { Button, Stepper, useAside } from '@nuvens/ui';
import { type MappedProductOptions } from '@shopify/hydrogen';
import type { Maybe, ProductOptionValueSwatch } from '@shopify/hydrogen/storefront-api-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { type ProductFragment } from '../types/storefrontapi.generated';
import { AddToCartButton } from './cart';
import { LocalizedLink } from './LocalizedLink';

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
                  available: isAvailable,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                const isDisabled = !exists;

                if (isDifferentProduct) {
                  return (
                    <Button
                      asChild
                      key={option.name + name}
                      variant={selected ? 'secondary' : 'outline'}
                      size="sm"
                      aria-pressed={selected}
                      disabled={isDisabled || !isAvailable}
                    >
                      <LocalizedLink
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                        aria-current={selected ? 'true' : undefined}
                      >
                        <ProductOptionSwatch swatch={swatch} />
                        asdf{!swatch?.color && !swatch?.image ? name : null}
                      </LocalizedLink>
                    </Button>
                  );
                }

                return (
                  <Button
                    key={option.name + name}
                    type="button"
                    variant={selected ? 'secondary' : 'outline'}
                    size="sm"
                    aria-pressed={selected}
                    disabled={isDisabled || !isAvailable}
                    onClick={() => {
                      if (!selected) {
                        navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                    aria-label={name}
                  >
                    <ProductOptionSwatch swatch={swatch} />
                    {!swatch?.color && !swatch?.image ? name : null}
                  </Button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div className="flex gap-3">
        <Stepper
          value={qty}
          min={1}
          max={maxQty}
          size="md"
          decDisabled={qty <= 1}
          incDisabled={qty >= maxQty}
          decreaseLabel={t('decrease')}
          increaseLabel={t('increase')}
          onChange={(v) => setQty(v)}
        />

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
                detail: {
                  variantId: selectedVariant?.id,
                  quantity: Math.min(qty, maxQty),
                },
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

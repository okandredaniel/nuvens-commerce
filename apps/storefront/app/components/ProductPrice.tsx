import { Money } from '@shopify/hydrogen';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import { useTranslation } from 'react-i18next';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const { t } = useTranslation('product');

  if (!price) {
    return (
      <div className="product-price" aria-hidden="true">
        <span>&nbsp;</span>
      </div>
    );
  }

  const onSale =
    !!compareAtPrice && Number.parseFloat(compareAtPrice.amount) > Number.parseFloat(price.amount);

  const discountPercent = onSale
    ? Math.max(
        0,
        Math.round(
          (1 - Number.parseFloat(price.amount) / Number.parseFloat(compareAtPrice!.amount)) * 100,
        ),
      )
    : null;

  const badgeText =
    discountPercent !== null
      ? t('price.save_percent', { defaultValue: 'Save {{value}}%', value: discountPercent })
      : null;

  return (
    <div
      className="product-price"
      aria-live="polite"
      itemProp="offers"
      itemScope
      itemType="https://schema.org/Offer"
    >
      <div className="flex items-baseline gap-2">
        {onSale ? (
          <>
            <span className="text-sm text-gray-600">
              {t('price.from', { defaultValue: 'From' })}
            </span>
            <s className="text-sm text-gray-500/80">
              <Money data={compareAtPrice as MoneyV2} />
            </s>
            <span className="text-2xl font-semibold tracking-tight" itemProp="price">
              <Money data={price} />
            </span>
            {discountPercent ? (
              <span
                className="inline-flex rounded-md bg-red-600 px-2 py-0.5 text-xs font-semibold leading-none text-white"
                aria-label={badgeText || undefined}
              >
                {badgeText}
              </span>
            ) : null}
          </>
        ) : (
          <span className="text-2xl font-semibold tracking-tight" itemProp="price">
            <Money data={price} />
          </span>
        )}
        <meta itemProp="priceCurrency" content={price.currencyCode} />
        <meta itemProp="price" content={price.amount} />
      </div>
    </div>
  );
}

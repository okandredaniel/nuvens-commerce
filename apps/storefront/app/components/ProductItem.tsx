import { useVariantUrl } from '@/lib/variants';
import { Image, Money } from '@shopify/hydrogen';
import type { CollectionItemFragment, ProductCardFragment } from 'storefrontapi.generated';
import { LocalizedLink } from './LocalizedLink';

type ProductLike = CollectionItemFragment | ProductCardFragment;

export function ProductItem({
  product,
  loading = 'lazy',
}: {
  product: ProductLike;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage ?? null;
  const price = product.priceRange?.minVariantPrice;

  return (
    <LocalizedLink
      to={variantUrl}
      aria-label={product.title}
      className="group block rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2"
    >
      <div className="overflow-hidden rounded-t-2xl">
        <div className="relative aspect-square bg-[color:var(--color-muted-ghost)]">
          {image ? (
            <Image
              alt={image.altText ?? product.title}
              data={image}
              aspectRatio="1/1"
              loading={loading}
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 33vw, 50vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h4 className="line-clamp-2 text-sm sm:text-base font-medium text-[color:var(--color-on-surface)]">
          {product.title}
        </h4>

        {price ? (
          <div className="mt-1 text-sm sm:text-[15px] font-semibold text-[color:var(--color-on-surface)]">
            <Money data={price} />
          </div>
        ) : null}
      </div>
    </LocalizedLink>
  );
}

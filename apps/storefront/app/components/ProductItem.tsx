import { Image, Money } from '@shopify/hydrogen';
import type { CollectionItemFragment, ProductItemFragment } from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { LocalizedLink } from './LocalizedLink';

type ProductLike = CollectionItemFragment | ProductItemFragment;

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
    <LocalizedLink className="product-item" prefetch="intent" to={variantUrl}>
      {image ? (
        <Image
          alt={image.altText ?? product.title}
          data={image}
          aspectRatio="1/1"
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      ) : null}

      <h4>{product.title}</h4>

      {price ? (
        <small>
          <Money data={price} />
        </small>
      ) : null}
    </LocalizedLink>
  );
}

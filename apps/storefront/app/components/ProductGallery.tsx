import { Image } from '@shopify/hydrogen';
import { useEffect, useMemo, useState } from 'react';
import type { ProductFragment, ProductVariantFragment } from 'storefrontapi.generated';

type GalleryImage = NonNullable<ProductVariantFragment['image']>;

function isValid(img?: GalleryImage | null): img is GalleryImage {
  return !!img && !!img.url;
}

function uniqueById<T extends { id?: string | null }>(arr: T[]) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of arr) {
    const key = String(it.id || '');
    if (!seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  }
  return out;
}

export function ProductGallery({
  product,
  variantImage,
}: {
  product: ProductFragment;
  variantImage?: ProductVariantFragment['image'] | null;
}) {
  const fromImages = (product as any)?.images?.nodes?.filter(isValid) ?? [];
  const fromMedia =
    (product as any)?.media?.nodes
      ?.map((m: any) => (m?.__typename === 'MediaImage' ? m?.image : null))
      ?.filter(isValid) ?? [];

  const base = useMemo(
    () => uniqueById<GalleryImage>([...fromMedia, ...fromImages]),
    [fromImages, fromMedia],
  );

  const withVariant = useMemo(() => {
    if (isValid(variantImage)) {
      const found = base.find((i) => i.id === variantImage!.id);
      return found ? base : uniqueById<GalleryImage>([variantImage as GalleryImage, ...base]);
    }
    return base;
  }, [base, variantImage]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isValid(variantImage)) {
      const i = withVariant.findIndex((img) => img.id === variantImage!.id);
      if (i >= 0 && i !== index) setIndex(i);
    }
  }, [variantImage, withVariant, index]);

  const current = withVariant[index];

  if (!current) {
    return <div className="aspect-square w-full rounded-2xl bg-[color:var(--color-muted)]/10" />;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl">
        <Image
          data={current}
          alt={current.altText || product.title}
          aspectRatio="1/1"
          sizes="(min-width:1024px) 50vw, 100vw"
          className="w-full"
        />
      </div>

      {withVariant.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {withVariant.map((img, i) => {
            const active = i === index;
            return (
              <button
                key={img.id || i}
                type="button"
                aria-pressed={active}
                onClick={() => setIndex(i)}
                className={`relative overflow-hidden rounded-xl ring-1 ring-black/10 transition ${
                  active
                    ? 'outline outline-2 outline-[color:var(--color-accent)]'
                    : 'hover:opacity-90'
                }`}
              >
                <Image
                  data={img}
                  alt={img.altText || ''}
                  aspectRatio="1/1"
                  sizes="(min-width:1024px) 10vw, 20vw"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

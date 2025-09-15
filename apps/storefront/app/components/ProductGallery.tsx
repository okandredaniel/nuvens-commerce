import { Image } from '@shopify/hydrogen';
import { useKeenSlider } from 'keen-slider/react.es';
import { useEffect, useMemo, useState } from 'react';
import type { ProductFragment, ProductVariantFragment } from 'storefrontapi.generated';

type GalleryImage = NonNullable<ProductVariantFragment['image']>;

function isValid(img?: GalleryImage | null): img is GalleryImage {
  return !!img && !!img.url;
}

function uniqueBy<T>(arr: T[], getKey: (t: T) => string) {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of arr) {
    const key = getKey(it);
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
  const fromImages = useMemo(
    () => ((product as any)?.images?.nodes?.filter(isValid) ?? []) as GalleryImage[],
    [product],
  );

  const fromMedia = useMemo(
    () =>
      (((product as any)?.media?.nodes ?? [])
        .map((m: any) => (m?.__typename === 'MediaImage' ? m?.image : null))
        .filter(isValid) as GalleryImage[]) ?? [],
    [product],
  );

  const base = useMemo(
    () =>
      uniqueBy<GalleryImage>([...fromMedia, ...fromImages], (img) =>
        String(img.id || img.url || ''),
      ),
    [fromImages, fromMedia],
  );

  const images = useMemo(() => {
    if (isValid(variantImage)) {
      const exists = base.find((i) => i.id === variantImage!.id || i.url === variantImage!.url);
      return exists
        ? base
        : uniqueBy<GalleryImage>([variantImage as GalleryImage, ...base], (img) =>
            String(img.id || img.url || ''),
          );
    }
    return base;
  }, [base, variantImage?.id, variantImage?.url]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isValid(variantImage)) {
      const i = images.findIndex(
        (img) => img.id === variantImage!.id || img.url === variantImage!.url,
      );
      if (i >= 0) setIndex(i);
    } else {
      setIndex(0);
    }
  }, [variantImage?.id, variantImage?.url, images]);

  useEffect(() => {
    if (index > images.length - 1) setIndex(Math.max(0, images.length - 1));
  }, [images.length, index]);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    created(s) {
      setIndex(s.track.details.rel);
    },
    animationEnded(s) {
      setIndex(s.track.details.rel);
    },
  });

  useEffect(() => {
    const rel = slider.current?.track.details.rel;
    if (slider.current && rel !== index) {
      slider.current.moveToIdx(index);
    }
  }, [index, slider]);

  const current = images[index];

  if (!current) {
    return <div className="aspect-square w-full rounded-2xl bg-[color:var(--color-muted)]/10" />;
  }

  return (
    <div className="space-y-4">
      <div ref={sliderRef} className="keen-slider overflow-hidden rounded-2xl">
        {images.map((img, i) => (
          <div key={img.id || img.url || i} className="keen-slider__slide">
            <Image
              data={img}
              alt={img.altText || product.title}
              aspectRatio="1/1"
              sizes="(min-width:1024px) 50vw, 100vw"
              className="w-full"
            />
          </div>
        ))}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {images.map((img, i) => {
            const active = i === index;
            return (
              <button
                key={(img.id || img.url || i) + '-thumb'}
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

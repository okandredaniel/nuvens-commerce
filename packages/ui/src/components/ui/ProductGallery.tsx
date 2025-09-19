import type { ProductGalleryProps } from '@nuvens/core';
import { ensureVariantFirst, isValidImage } from '@nuvens/core';
import { useKeenSlider } from 'keen-slider/react.es';
import { useEffect, useMemo, useState } from 'react';

export function ProductGallery({
  Image,
  images: imagesProp,
  variantImage,
  className,
  sizesMain = '(min-width:1024px) 50vw, 100vw',
  sizesThumb = '(min-width:1024px) 10vw, 20vw',
  aspectRatioMain = '1/1',
  aspectRatioThumb = '1/1',
  initialIndex = 0,
  onIndexChange,
}: ProductGalleryProps) {
  const base = useMemo(() => imagesProp.filter(isValidImage), [imagesProp]);
  const images = useMemo(() => ensureVariantFirst(base, variantImage), [base, variantImage]);

  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (isValidImage(variantImage)) {
      const i = images.findIndex(
        (img) => img.id === variantImage.id || img.url === variantImage.url,
      );
      if (i >= 0) setIndex(i);
    } else {
      setIndex((v) => (Number.isFinite(initialIndex) ? initialIndex : v));
    }
  }, [variantImage, images, initialIndex]);

  useEffect(() => {
    if (index > images.length - 1) setIndex(Math.max(0, images.length - 1));
  }, [images.length, index]);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    created(s) {
      const rel = s.track.details.rel;
      setIndex(rel);
      onIndexChange?.(rel);
    },
    animationEnded(s) {
      const rel = s.track.details.rel;
      setIndex(rel);
      onIndexChange?.(rel);
    },
    slideChanged(s) {
      const rel = s.track.details.rel;
      setIndex(rel);
      onIndexChange?.(rel);
    },
  });

  useEffect(() => {
    const rel = slider.current?.track.details.rel;
    if (slider.current && rel !== index) slider.current.moveToIdx(index);
  }, [index, slider]);

  const current = images[index];

  if (!current) {
    return <div className={`aspect-square w-full rounded-xl bg-neutral-100 ${className ?? ''}`} />;
  }

  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      <div ref={sliderRef} className="keen-slider overflow-hidden rounded-xl">
        {images.map((img, i) => (
          <div key={img.id ?? img.url ?? i} className="keen-slider__slide">
            <div className="relative w-full" style={{ aspectRatio: aspectRatioMain }}>
              <Image
                src={img.url}
                alt={img.altText ?? ''}
                sizes={sizesMain}
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {images.map((img, i) => {
            const active = i === index;
            return (
              <button
                key={(img.id ?? img.url ?? i) + '-thumb'}
                type="button"
                aria-pressed={active}
                aria-label={img.altText ? `View ${img.altText}` : `View image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`relative overflow-hidden rounded-xl ring-1 ring-neutral-200 transition focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0 ${
                  active
                    ? 'ring-2 ring-primary-600 ring-offset-2 ring-offset-neutral-0'
                    : 'hover:opacity-90 hover:ring-neutral-300'
                }`}
              >
                <div className="relative w-full" style={{ aspectRatio: aspectRatioThumb }}>
                  <Image
                    src={img.url}
                    alt={img.altText ?? ''}
                    sizes={sizesThumb}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

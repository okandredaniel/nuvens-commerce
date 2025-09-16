import type { ProductTemplateProps } from '@nuvens/core';
import { Accordion, Container, Heading, placeholderImage, VideoPreviewWithModal } from '@nuvens/ui';
import { CircleCheckBig } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import zippexLayers from '../assets/zippex-layers.png';
import { ComfortCTA } from '../blocks/ComfortCTA';
import { PersonalizeSection } from '../blocks/PersonalizeSection';
import { ReviewsSection } from '../blocks/ReviewsSection';
import { SupportSection } from '../blocks/SupportSection';
import { TrustedByCarousel } from '../blocks/TrustedByCarousel';
import { WhyZippex } from '../blocks/WhyZippex';

export function ProductPage({
  product,
  selectedVariant,
  productOptions,
  maxQty,
  slots,
  meta,
}: ProductTemplateProps) {
  const { t } = useTranslation('product');
  const { Image, ProductForm, RichText, ProductPrice, ProductRating, ProductGallery } = slots;

  const defaultBullets = [
    t('aside.bullets.consumerChoice'),
    t('aside.bullets.fitsAll'),
    t('aside.bullets.sixInOne'),
    t('aside.bullets.designedAndMade'),
  ];
  const bullets = meta.usp_bullets?.length ? meta.usp_bullets : defaultBullets;
  const resolvedMaxQty = Number.isFinite(meta.max_qty as any) ? (meta.max_qty as number) : maxQty;

  return (
    <>
      <Container className="py-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <section aria-label={t('media')}>
            <ProductGallery product={product} variantImage={selectedVariant?.image} />
          </section>

          <aside className="lg:sticky lg:top-24" aria-labelledby="product-title">
            <Heading id="product-title" as="h1">
              {product.title}
            </Heading>

            {ProductRating && meta.rating_value != null && meta.rating_count != null ? (
              <ProductRating rating={meta.rating_value} count={meta.rating_count} />
            ) : null}

            <div className="mt-3" role="status" aria-live="polite">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>

            {product.descriptionHtml ? (
              <section className="mt-8" aria-labelledby="product-description-heading">
                <h2 id="product-description-heading" className="mb-2 text-base font-semibold">
                  {t('description')}
                </h2>
                <RichText
                  html={product.descriptionHtml}
                  className="prose prose-sm prose-neutral max-w-none [&_img]:rounded-lg dark:prose-invert"
                />
              </section>
            ) : null}

            <ul className="flex flex-col gap-4 my-8">
              {bullets.map((text, i) => (
                <li key={i} className="flex gap-2">
                  <CircleCheckBig className="text-[#00C7D5]" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="my-8">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
                maxQty={resolvedMaxQty}
              />
            </div>

            <Accordion type="single" items={meta.info_items ?? []} defaultValue="0" />
          </aside>
        </div>

        <WhyZippex image={Image} />
      </Container>

      <PersonalizeSection
        Image={Image}
        layersSrc={zippexLayers}
        eyebrow={t('personalize.eyebrow')}
        title={t('personalize.title')}
        cta={t('personalize.cta')}
      />

      {meta.video_youtube_id ? (
        <section className="py-16" aria-labelledby="video-heading">
          <Container>
            <Heading id="video-heading" className="mb-8" align="center">
              {t('videoHeading')}
            </Heading>
            <div className="overflow-hidden md:rounded-4xl">
              <VideoPreviewWithModal
                previewSrc={meta.video_preview}
                youtubeId={meta.video_youtube_id}
              />
            </div>
          </Container>
        </section>
      ) : null}

      {meta.trusted_youtube_ids?.length ? (
        <TrustedByCarousel heading={t('trusted.heading')} youtubeIds={meta.trusted_youtube_ids} />
      ) : null}

      <section className="py-16">
        <Container>
          <ReviewsSection headingId="reviews-heading" />
        </Container>
      </section>

      <ComfortCTA
        Image={Image}
        imageAlt={t('comfort.imageAlt')}
        imageSrc={meta.comfort_image ?? placeholderImage}
        title={t('comfort.title')}
        text={t('comfort.text')}
        cta={t('comfort.cta')}
      />

      <section className="py-16">
        <Container>
          <Heading className="mb-8">{t('detailsHeading')}</Heading>
          <Accordion type="single" items={meta.faq_items ?? []} defaultValue="0" />
        </Container>
      </section>

      <section className="py-16 bg-[#A6ABBD]/20">
        <Container>
          <SupportSection headingId="support-heading" />
        </Container>
      </section>
    </>
  );
}

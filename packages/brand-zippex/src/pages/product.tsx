import type { ProductTemplateProps } from '@nuvens/core';
import {
  Accordion,
  Container,
  Heading,
  placeholderImage,
  ProductGallery,
  VideoPreviewWithModal,
} from '@nuvens/ui';
import { CircleCheckBig } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { shopifyProductToImages, shopifyVariantImage } from '../adapters/shopifyGallery';
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
  const { Image, ProductForm, RichText, ProductPrice, ProductRating } = slots;

  const images = shopifyProductToImages(product);
  const variantImg = shopifyVariantImage(selectedVariant);

  const defaultBullets = [
    t('aside.bullets.consumerChoice'),
    t('aside.bullets.fitsAll'),
    t('aside.bullets.sixInOne'),
    t('aside.bullets.designedAndMade'),
  ];
  const bullets = meta.uspBullets?.length ? meta.uspBullets : defaultBullets;
  const resolvedMaxQty = Number.isFinite(meta.maxQty as any) ? (meta.maxQty as number) : maxQty;

  return (
    <>
      <Container className="py-6 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <section aria-label={t('media')} className="min-w-0">
            <ProductGallery Image={Image} images={images} variantImage={variantImg} />
          </section>

          <aside className="min-w-0 lg:sticky lg:top-24" aria-labelledby="product-title">
            <Heading id="product-title" as="h1">
              {product.title}
            </Heading>

            {ProductRating && meta.ratingValue != null && meta.ratingCount != null ? (
              <ProductRating rating={meta.ratingValue} count={meta.ratingCount} />
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
                  className="prose prose-sm prose-neutral max-w-none [&img]:rounded-lg"
                />
              </section>
            ) : null}

            <ul className="my-8 flex flex-col gap-4">
              {bullets.map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-neutral-900">
                  <CircleCheckBig className="h-5 w-5 text-primary-400" aria-hidden />
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

            <Accordion
              type="single"
              items={meta.infoItems ?? []}
              defaultValue="0"
              ariaToggleLabel={t('accordion.toggle')}
            />
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

      {meta.videoYoutubeId ? (
        <section className="py-16" aria-labelledby="video-heading">
          <Container>
            <Heading id="video-heading" className="mb-8" align="center">
              {t('videoHeading')}
            </Heading>
            <VideoPreviewWithModal previewSrc={meta.videoPreview} youtubeId={meta.videoYoutubeId} />
          </Container>
        </section>
      ) : null}

      {meta.trustedYoutubeIds?.length ? (
        <TrustedByCarousel heading={t('trusted.heading')} youtubeIds={meta.trustedYoutubeIds} />
      ) : null}

      <section className="py-16">
        <Container>
          <ReviewsSection headingId="reviews-heading" Image={Image} />
        </Container>
      </section>

      <ComfortCTA
        Image={Image}
        imageAlt={t('comfort.imageAlt')}
        imageSrc={meta.comfortImage ?? placeholderImage}
        title={t('comfort.title')}
        text={t('comfort.text')}
        cta={t('comfort.cta')}
      />

      <section className="py-16">
        <Container>
          <Heading className="mb-8">{t('detailsHeading')}</Heading>
          <Accordion
            type="single"
            items={meta.faqItems ?? []}
            defaultValue="0"
            ariaToggleLabel={t('accordion.toggle')}
          />
        </Container>
      </section>

      <section className="bg-primary-100/40 py-16">
        <Container>
          <SupportSection headingId="support-heading" />
        </Container>
      </section>
    </>
  );
}

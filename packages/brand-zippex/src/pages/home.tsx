import { type ImageProps } from '@nuvens/core';
import { Container, VideoPreviewWithModal } from '@nuvens/ui';
import { useTranslation } from 'react-i18next';
import { ComfortSection } from '../blocks/ComfortSection';
import { Hero } from '../blocks/hero';
import { IntroCta } from '../blocks/IntroCta';
import { PromisesCarousel } from '../blocks/PromisesCarousel';
import { ReviewsSection } from '../blocks/ReviewsSection';
import { SupportSection } from '../blocks/SupportSection';

type HomePageProps = { slots: { Image: ImageProps } };

export function HomePage({ slots }: HomePageProps) {
  const { t } = useTranslation('home');
  const { Image } = slots;

  return (
    <>
      <Hero />

      <section aria-labelledby="intro-heading" className="py-16">
        <Container className="max-w-2xl text-center">
          <IntroCta headingId="intro-heading" />
        </Container>
      </section>

      <section aria-labelledby="video-heading" className="md:px-24">
        <h2 id="video-heading" className="sr-only">
          {t('video.title')}
        </h2>
        <div className="overflow-hidden md:rounded-4xl">
          <VideoPreviewWithModal
            previewSrc="/zippex-cambio-de-nucleos.mov"
            youtubeId="m_lfbLhKIMI"
          />
        </div>
      </section>

      <section aria-labelledby="comfort-heading" className="py-16">
        <Container>
          <ComfortSection headingId="comfort-heading" Image={Image} />
        </Container>
      </section>

      <section
        aria-labelledby="promises-heading"
        className="py-16 bg-[color:var(--color-brand-primary)]"
      >
        <Container>
          <PromisesCarousel headingId="promises-heading" />
        </Container>
      </section>

      <section aria-labelledby="reviews-heading" className="py-16">
        <Container>
          <ReviewsSection headingId="reviews-heading" />
        </Container>
      </section>

      <section
        aria-labelledby="support-heading"
        className="py-16 bg-neutral-100 text-center text-slate-600"
      >
        <Container>
          <SupportSection headingId="support-heading" />
        </Container>
      </section>
    </>
  );
}

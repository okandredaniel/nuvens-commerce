import { Container } from '@nuvens/ui';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { VideoPreviewWithModal } from '../../components';
import {
  ComfortSection,
  Hero,
  IntroCta,
  PromisesCarousel,
  ReviewsSection,
  SupportSection,
} from './sections';

export async function homeLoader(_: LoaderFunctionArgs) {
  return null;
}

export function HomePage() {
  const { t } = useTranslation('home');

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
          <ComfortSection headingId="comfort-heading" />
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

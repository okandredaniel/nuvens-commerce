import { Carousel, CarouselSlide, Container, Heading, VideoPreviewWithModal } from '@nuvens/ui';
import { useTranslation } from 'react-i18next';

type Props = {
  heading: string;
  youtubeIds: string[];
};

export function TrustedByCarousel({ heading, youtubeIds }: Props) {
  const { t } = useTranslation('common');

  const i18n = {
    label: heading,
    previous: t('carousel.previous'),
    next: t('carousel.next'),
    goTo: (index: number) => t('carousel.goTo', { index }),
    status: (current: number, total: number) =>
      t('carousel.status', {
        current,
        total,
      }),
  };

  return (
    <section className="py-16 bg-primary-50">
      <Container>
        <Heading as="h2" className="mb-8">
          {heading}
        </Heading>
        <Carousel
          className="mx-auto w-full"
          nav={false}
          i18n={i18n}
          slidesPerView={{
            0: 1.5,
            768: 6,
          }}
          bleedLeft={{
            0: 16,
            768: 0,
          }}
          edgeLeft={{
            0: 16,
            768: 0,
          }}
          bleedRight={{
            0: 16,
            768: 0,
          }}
          edgeRight={{
            0: 0,
            768: 0,
          }}
        >
          {youtubeIds.map((id, i) => (
            <CarouselSlide key={i} className="h-full">
              <VideoPreviewWithModal youtubeId={id} vertical />
            </CarouselSlide>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}

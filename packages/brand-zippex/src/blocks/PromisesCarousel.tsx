import { Card, CardContent, Carousel, CarouselSlide, Heading } from '@nuvens/ui';
import { DollarSign, Globe, Moon, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const items = [
  { icon: Moon, titleKey: 'promise.items.0.title', bodyKey: 'promise.items.0.body' },
  { icon: Globe, titleKey: 'promise.items.1.title', bodyKey: 'promise.items.1.body' },
  { icon: DollarSign, titleKey: 'promise.items.2.title', bodyKey: 'promise.items.2.body' },
  { icon: ThumbsUp, titleKey: 'promise.items.3.title', bodyKey: 'promise.items.3.body' },
];

export function PromisesCarousel({ headingId }: { headingId: string }) {
  const { t } = useTranslation('home');

  const i18n = {
    label: t('promise.aria'),
    previous: t('carousel.previous'),
    next: t('carousel.next'),
    goTo: (index: number) => t('carousel.goTo', { index }),
    status: (current: number, total: number) => t('carousel.status', { current, total }),
  };

  return (
    <section aria-labelledby={headingId} className="w-full">
      <Heading id={headingId} as="h2" tone="onPrimary" align="center" className="mb-16">
        {t('promise.title')}
      </Heading>

      <Carousel
        className="mx-auto w-full"
        nav={false}
        i18n={i18n}
        slidesPerView={{ 0: 1.5, 768: 4 }}
        bleedLeft={{ 0: 16, 768: 0 }}
        edgeLeft={{ 0: 16, 768: 0 }}
        bleedRight={{ 0: 16, 768: 0 }}
        edgeRight={{ 0: 0, 768: 0 }}
      >
        {items.map(({ icon: Icon, titleKey, bodyKey }) => (
          <CarouselSlide key={titleKey} className="h-full">
            <Card className="h-full">
              <CardContent className="flex h-full flex-col items-center text-center">
                <Icon className="mb-4 h-16 w-16 text-neutral-400" strokeWidth={1} aria-hidden />
                <Heading as="h3" align="center" className="my-3 text-primary-600">
                  {t(titleKey)}
                </Heading>
                <p className="text-neutral-700">{t(bodyKey)}</p>
              </CardContent>
            </Card>
          </CarouselSlide>
        ))}
      </Carousel>
    </section>
  );
}

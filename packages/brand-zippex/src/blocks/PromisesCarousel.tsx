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
  return (
    <div>
      <Heading id={headingId} as="h2" className="mb-16 text-white" align="center">
        {t('promise.title')}
      </Heading>
      <Carousel
        aria-label={t('promise.aria')}
        className="w-full mx-auto"
        nav={false}
        // eslint-disable-next-line @typescript-eslint/naming-convention
        slidesPerView={{ 0: 1.5, 768: 4 }}
        // eslint-disable-next-line @typescript-eslint/naming-convention
        bleedLeft={{ 0: 16, 768: 0 }}
        // eslint-disable-next-line @typescript-eslint/naming-convention
        edgeLeft={{ 0: 16, 768: 0 }}
        // eslint-disable-next-line @typescript-eslint/naming-convention
        bleedRight={{ 0: 16, 768: 0 }}
        // eslint-disable-next-line @typescript-eslint/naming-convention
        edgeRight={{ 0: 0, 768: 0 }}
      >
        {items.map(({ icon: Icon, titleKey, bodyKey }) => (
          <CarouselSlide key={titleKey} className="h-full">
            <Card className="text-center py-4 h-full">
              <CardContent>
                <Icon className="m-auto text-slate-400" size={80} strokeWidth={1} aria-hidden />
                <Heading
                  as="h3"
                  align="center"
                  className="text-xl text-[color:var(--color-brand-primary)] my-4"
                >
                  {t(titleKey)}
                </Heading>
                <p>{t(bodyKey)}</p>
              </CardContent>
            </Card>
          </CarouselSlide>
        ))}
      </Carousel>
    </div>
  );
}

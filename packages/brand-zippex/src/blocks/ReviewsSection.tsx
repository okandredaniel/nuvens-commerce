import { type ImageProps } from '@nuvens/core';
import { LocalizedNavLink } from '@nuvens/shopify';
import {
  Button,
  Carousel,
  CarouselSlide,
  Heading,
  RatingStars,
  ReviewCard,
  trustpilotLogo,
} from '@nuvens/ui';
import { useTranslation } from 'react-i18next';

const reviews = [
  {
    name: 'Camille',
    body: 'Livraison rapide et matelas très confortable. Je dors enfin sans me réveiller la nuit.',
    rating: 5,
    verified: true,
    date: '2024-05-12',
  },
  {
    name: 'Julien',
    body: 'Bon maintien et finition impeccable. Après une semaine, plus de douleurs au dos.',
    rating: 5,
    verified: true,
    date: '2024-06-03',
  },
  {
    name: 'Sofia',
    body: 'Texture agréable, ni trop ferme ni trop souple. Rapport qualité/prix excellent.',
    rating: 4,
    verified: false,
    date: '2024-04-27',
  },
  {
    name: 'Pedro',
    body: 'Montage simple, service client réactif. Le sommeil est clairement meilleur.',
    rating: 5,
    verified: true,
    date: '2024-03-18',
  },
  {
    name: 'Chloé',
    body: 'Très bonne aération, pas de chaleur la nuit. J’apprécie aussi l’esthétique.',
    rating: 4,
    verified: true,
    date: '2024-02-09',
  },
  {
    name: 'Marco',
    body: 'On sent la qualité dès la première nuit. Je recommande sans hésiter.',
    rating: 5,
    verified: true,
    date: '2024-01-22',
  },
];

export function ReviewsSection({ headingId, Image }: { headingId: string; Image: ImageProps }) {
  const { t, i18n } = useTranslation('home');
  const { t: tCommon } = useTranslation('common');

  const i18nCarousel = {
    label: t('reviews.title'),
    previous: tCommon('carousel.previous'),
    next: tCommon('carousel.next'),
    goTo: (index: number) => tCommon('carousel.goTo', { index }),
    status: (current: number, total: number) => tCommon('carousel.status', { current, total }),
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <Heading id={headingId} as="h2" className="text-primary-600 text-4xl" align="center">
          {t('reviews.title')}
        </Heading>
        <div className="flex items-center gap-4" aria-live="polite">
          <RatingStars value={5} />
          <span className="text-neutral-700">{t('reviews.summary')}</span>
        </div>
      </div>

      <div className="py-16">
        <div className="md:hidden">
          <Carousel
            className="w-full"
            i18n={i18nCarousel}
            slidesPerView={{ 0: 1 }}
            gap={{ 0: 16 }}
            bleedLeft={{ 0: 16 }}
            bleedRight={{ 0: 16 }}
            edgeLeft={{ 0: 0 }}
            edgeRight={{ 0: 0 }}
            nav={false}
            dots
          >
            {reviews.map((r, idx) => (
              <CarouselSlide key={idx} className="px-2">
                <div className="mx-auto max-w-sm">
                  <ReviewCard
                    name={r.name}
                    text={r.body}
                    rating={r.rating}
                    Image={Image}
                    ratingLabel={t('reviews.ratingLabel', { rating: `${r.rating}/5` })}
                    logoSrc={trustpilotLogo}
                    verified={r.verified}
                    verifiedLabel={t('reviews.verified', { defaultValue: 'Verified' })}
                    date={r.date ? new Date(r.date).toLocaleDateString(i18n.language) : undefined}
                  />
                </div>
              </CarouselSlide>
            ))}
          </Carousel>
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:gap-8">
          {reviews.map((r, idx) => (
            <ReviewCard
              key={idx}
              name={r.name}
              text={r.body}
              rating={r.rating}
              Image={Image}
              ratingLabel={t('reviews.ratingLabel', { rating: `${r.rating}/5` })}
              logoSrc={trustpilotLogo}
              verified={r.verified}
              verifiedLabel={t('reviews.verified', { defaultValue: 'Verified' })}
              date={r.date ? new Date(r.date).toLocaleDateString(i18n.language) : undefined}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button asChild>
          <LocalizedNavLink to="/pages/reviews">{t('reviews.cta')}</LocalizedNavLink>
        </Button>
      </div>
    </div>
  );
}

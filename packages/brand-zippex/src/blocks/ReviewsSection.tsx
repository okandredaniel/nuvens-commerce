import { type ImageProps } from '@nuvens/core';
import { Button, Heading, ReviewCard, trustpilotLogo } from '@nuvens/ui';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="inline-flex gap-1" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} className="h-5 w-5 text-warning-400" />
      ))}
    </div>
  );
}

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

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <Heading id={headingId} as="h2" className="text-4xl text-primary-600" align="center">
          {t('reviews.title')}
        </Heading>
        <div className="flex items-center gap-4" aria-live="polite">
          <Stars />
          <span className="text-neutral-700">{t('reviews.summary')}</span>
        </div>
      </div>

      <div className="grid gap-8 py-16 md:grid-cols-3">
        {reviews.map((r, idx) => (
          <ReviewCard
            key={idx}
            name={r.name}
            text={r.body}
            rating={r.rating}
            ratingLabel={t('reviews.ratingLabel', { rating: `${r.rating}/5` })}
            Image={Image}
            logoSrc={trustpilotLogo}
            verified={r.verified}
            verifiedLabel="Verified"
            date={r.date ? new Date(r.date).toLocaleDateString(i18n.language) : undefined}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button asChild>
          <a href="/avis">{t('reviews.cta')}</a>
        </Button>
      </div>
    </div>
  );
}

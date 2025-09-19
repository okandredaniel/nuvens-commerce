import { type ImageProps } from '@nuvens/core';
import { Button, Card, CardContent, Heading, trustpilotLogo } from '@nuvens/ui';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="inline-flex gap-1" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} className="text-warning-400 h-5 w-5" />
      ))}
    </div>
  );
}

const reviews = [
  {
    name: 'Camille',
    body: 'Livraison rapide et matelas très confortable. Je dors enfin sans me réveiller la nuit.',
    rating: 5,
  },
  {
    name: 'Julien',
    body: 'Bon maintien et finition impeccable. Après une semaine, plus de douleurs au dos.',
    rating: 5,
  },
  {
    name: 'Sofia',
    body: 'Texture agréable, ni trop ferme ni trop souple. Rapport qualité/prix excellent.',
    rating: 4,
  },
  {
    name: 'Pedro',
    body: 'Montage simple, service client réactif. Le sommeil est clairement meilleur.',
    rating: 5,
  },
  {
    name: 'Chloé',
    body: 'Très bonne aération, pas de chaleur la nuit. J’apprécie aussi l’esthétique.',
    rating: 4,
  },
  {
    name: 'Marco',
    body: 'On sent la qualité dès la première nuit. Je recommande sans hésiter.',
    rating: 5,
  },
];

export function ReviewsSection({ headingId, Image }: { headingId: string; Image: ImageProps }) {
  const { t } = useTranslation('home');

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <Heading id={headingId} as="h2" className="text-primary-600 text-4xl" align="center">
          {t('reviews.title')}
        </Heading>
        <div className="flex items-center gap-4" aria-live="polite">
          <Stars />
          <span className="text-neutral-700">{t('reviews.summary')}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 py-16">
        {reviews.map((r, idx) => (
          <Card key={idx} className="bg-neutral-50 border-none">
            <CardContent>
              <div className="flex justify-between items-center">
                <Image
                  src={trustpilotLogo}
                  alt="Trustpilot"
                  width={100}
                  sizes="(min-width:1024px) 560px, (min-width:768px) 50vw, 100vw"
                />
                <div
                  className="flex items-center gap-2"
                  aria-label={t('reviews.ratingLabel', { rating: `${r.rating}/5` })}
                >
                  <Stars count={r.rating} />
                  <span className="text-neutral-700">{r.rating}/5</span>
                </div>
              </div>
              <Heading as="h3" className="text-primary-600 my-4">
                {r.name}
              </Heading>
              <p className="text-neutral-700">{r.body}</p>
            </CardContent>
          </Card>
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

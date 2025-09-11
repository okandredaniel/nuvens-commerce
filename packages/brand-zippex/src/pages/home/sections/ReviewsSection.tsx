import { Button, Card, CardContent, Heading } from '@nuvens/ui';
import { Image } from '@shopify/hydrogen';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';
import trustpilot from '../../../../../../shared-assets/trustpilot-logo.png';

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="inline-flex gap-1" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <FaStar key={i} className="text-amber-400 h-5 w-5" />
      ))}
    </div>
  );
}

const reviews = [
  {
    name: 'Christophe',
    body: 'Sommier et matelas, le bonheur ! Enfin des nuits sereines...Merci Tediber.',
  },
  {
    name: 'Christophe',
    body: 'Sommier et matelas, le bonheur ! Enfin des nuits sereines...Merci Tediber.',
  },
  {
    name: 'Christophe',
    body: 'Sommier et matelas, le bonheur ! Enfin des nuits sereines...Merci Tediber.',
  },
];

export function ReviewsSection({ headingId }: { headingId: string }) {
  const { t } = useTranslation('home');
  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <Heading
          id={headingId}
          as="h2"
          className="text-[color:var(--color-brand-primary)] text-4xl"
          align="center"
        >
          {t('reviews.title')}
        </Heading>
        <div className="flex items-center gap-4" aria-live="polite">
          <Stars />
          <span>{t('reviews.summary')}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 py-16">
        {reviews.map((r, idx) => (
          <Card key={idx} className="bg-neutral-100 border-none">
            <CardContent>
              <div className="flex justify-between">
                <Image
                  src={trustpilot}
                  alt="Trustpilot"
                  width={100}
                  sizes="(min-width:1024px) 560px, (min-width:768px) 50vw, 100vw"
                />
                <div
                  className="flex items-center gap-2"
                  aria-label={t('reviews.ratingLabel', { rating: '5/5' })}
                >
                  <Stars />
                  <span>5/5</span>
                </div>
              </div>
              <Heading as="h3" className="text-[color:var(--color-brand-primary)] my-4">
                {r.name}
              </Heading>
              <p>{r.body}</p>
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

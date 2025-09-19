import { type ImageProps } from '@nuvens/core';
import { Button, Heading } from '@nuvens/ui';
import { useTranslation } from 'react-i18next';
import couple from '../assets/couple-lying-on-a-zippex-bed.png';

export function ComfortSection({ headingId, Image }: { headingId: string; Image: ImageProps }) {
  const { t } = useTranslation('home');
  return (
    <div>
      <Heading id={headingId} as="h2" align="center" className="mb-16 text-primary-600">
        {t('comfort.title')}
      </Heading>

      <div className="grid items-center gap-8 ui-radius-lg bg-gradient-to-r from-neutral-600 to-neutral-400 py-8 text-neutral-0 md:grid-cols-2 md:py-16">
        <div className="flex flex-col gap-8 px-8 md:p-16">
          <Heading as="h3" tone="onPrimary">
            {t('comfort.subtitle')}
          </Heading>
          <ul className="list-inside list-disc">
            <li>{t('comfort.items.0')}</li>
            <li>{t('comfort.items.1')}</li>
            <li>{t('comfort.items.2')}</li>
          </ul>
          <div>
            <Button asChild variant="white">
              <a href="/collections/all">{t('cta.buy')}</a>
            </Button>
          </div>
        </div>

        <div className="pl-16">
          <Image
            src={couple}
            alt={t('comfort.imageAlt')}
            width={1500}
            height={1000}
            sizes="(min-width:1024px) 560px, (min-width:768px) 50vw, 100vw"
          />
        </div>
      </div>
    </div>
  );
}

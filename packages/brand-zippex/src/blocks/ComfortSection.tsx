import { type ImageProps } from '@nuvens/core';
import { LocalizedNavLink } from '@nuvens/shopify';
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

      <div className="grid grid-cols-3 items-center gap-8 ui-radius-lg bg-gradient-to-r from-neutral-600 to-neutral-400 py-8 text-neutral-0 md:grid-cols-2 md:py-16">
        <div className="flex flex-col gap-8 px-8 md:pl-32 md:pr-0">
          <Heading as="h3" tone="onPrimary" className="text-6xl">
            {t('comfort.subtitle')}
          </Heading>
          <ul className="list-inside list-disc text-lg">
            <li>{t('comfort.items.0')}</li>
            <li>{t('comfort.items.1')}</li>
            <li>{t('comfort.items.2')}</li>
          </ul>
          <div>
            <Button asChild variant="primary" surface="dark" size="lg">
              <LocalizedNavLink to="/products/matelas-zippex">{t('cta.buy')}</LocalizedNavLink>
            </Button>
          </div>
        </div>

        <Image
          src={couple}
          alt={t('comfort.imageAlt')}
          width={1500}
          height={1000}
          sizes="(min-width:1024px) 560px, (min-width:768px) 50vw, 100vw"
        />
      </div>
    </div>
  );
}

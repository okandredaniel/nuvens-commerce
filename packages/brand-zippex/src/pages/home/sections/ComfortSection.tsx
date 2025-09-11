import { Button, Heading } from '@nuvens/ui';
import { Image } from '@shopify/hydrogen';
import { useTranslation } from 'react-i18next';
import couple from '../../home/assets/couple-lying-on-a-zippex-bed.png';

export function ComfortSection({ headingId }: { headingId: string }) {
  const { t } = useTranslation('home');
  return (
    <div>
      <Heading
        id={headingId}
        as="h2"
        className="mb-16 text-[color:var(--color-brand-primary)]"
        align="center"
      >
        {t('comfort.title')}
      </Heading>
      <div className="grid md:grid-cols-2 items-center py-8 gap-8 md:py-16 rounded-4xl text-white bg-[linear-gradient(90deg,var(--palette-neutral-600),var(--palette-neutral-400))]">
        <div className="flex flex-col gap-8 px-8 md:p-16">
          <Heading as="h3" className="text-inherit">
            {t('comfort.subtitle')}
          </Heading>
          <ul className="list-disc list-inside">
            <li>{t('comfort.items.0')}</li>
            <li>{t('comfort.items.1')}</li>
            <li>{t('comfort.items.2')}</li>
          </ul>
          <div>
            <Button variant="white">
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

import { Button, Heading } from '@nuvens/ui';
import { useTranslation } from 'react-i18next';

export function IntroCta({ headingId }: { headingId: string }) {
  const { t } = useTranslation('home');
  return (
    <div>
      <Heading id={headingId} as="h2" align="center" className="text-neutral-600">
        {t('intro.title')}
      </Heading>
      <p className="mt-8 mb-16 text-xl text-center text-neutral-700">{t('intro.lead')}</p>
      <Button asChild>
        <a href="/products/matelas-zippex">{t('cta.buy')}</a>
      </Button>
    </div>
  );
}

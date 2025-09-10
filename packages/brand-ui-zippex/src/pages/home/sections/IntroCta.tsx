import { Button, Heading } from '@nuvens/ui-core';
import { useTranslation } from 'react-i18next';

export function IntroCta({ headingId }: { headingId: string }) {
  const { t } = useTranslation('home');
  return (
    <div>
      <Heading
        id={headingId}
        as="h2"
        className="text-[color:var(--palette-neutral-500)]"
        align="center"
      >
        {t('intro.title')}
      </Heading>
      <p className="text-xl mt-8 mb-16">{t('intro.lead')}</p>
      <Button asChild>
        <a href="/collections/all">{t('cta.buy')}</a>
      </Button>
    </div>
  );
}

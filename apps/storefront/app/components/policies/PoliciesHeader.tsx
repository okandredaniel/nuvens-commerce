import { useTranslation } from 'react-i18next';

export function PoliciesHeader() {
  const { t } = useTranslation('policies');

  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--color-on-surface)]">
        {t('page.title')}
      </h1>
      <p className="mt-3 text-[color:var(--color-muted)]">{t('page.subtitle')}</p>
    </header>
  );
}

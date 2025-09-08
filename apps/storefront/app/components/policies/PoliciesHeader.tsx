import { cn } from '@nuvens/ui-core';
import { useTranslation } from 'react-i18next';

type PoliciesHeaderProps = {
  headingId?: string;
  className?: string;
};

export function PoliciesHeader({ headingId, className }: PoliciesHeaderProps) {
  const { t } = useTranslation('policies');

  return (
    <header className={cn('mb-8 text-center', className)}>
      <h1
        id={headingId}
        className="text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--color-on-surface)]"
      >
        {t('page.title')}
      </h1>
      <p className="mt-3 text-[color:var(--color-muted)]">{t('page.subtitle')}</p>
    </header>
  );
}

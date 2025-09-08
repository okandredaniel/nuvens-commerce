import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CompanyInfo() {
  const { t: tSupport } = useTranslation('support');

  return (
    <section className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-2xl">
      <div className="px-5 pt-5 pb-6">
        <h3 className="flex items-center gap-3 text-xl text-[color:var(--color-on-surface)]">
          <span className="p-2 rounded-lg bg-[color:var(--color-primary)]/10">
            <MapPin className="w-6 h-6 text-[color:var(--color-primary)]" />
          </span>
          {tSupport('company.title')}
        </h3>
      </div>
      <div className="px-5 pb-5 space-y-3">
        <div className="space-y-2 text-[color:var(--color-muted)] leading-relaxed">
          <p className="font-medium text-[color:var(--color-on-surface)]">
            {tSupport('company.name')}
          </p>
          <p>{tSupport('company.street')}</p>
          <p>{tSupport('company.cityZip')}</p>
          <p>{tSupport('company.kvk')}</p>
          <p>{tSupport('company.phone')}</p>
        </div>
      </div>
    </section>
  );
}

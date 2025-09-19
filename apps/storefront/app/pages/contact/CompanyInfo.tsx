import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function CompanyInfo() {
  const { t: tSupport } = useTranslation('support');

  return (
    <section className="rounded-2xl border border-neutral-200 bg-neutral-0">
      <div className="px-5 pb-6 pt-5">
        <h3 className="flex items-center gap-3 text-xl text-neutral-950">
          <span className="rounded-lg bg-primary-600/10 p-2">
            <MapPin className="h-6 w-6 text-primary-600" />
          </span>
          {tSupport('company.title')}
        </h3>
      </div>
      <div className="space-y-3 px-5 pb-5">
        <div className="space-y-2 leading-relaxed text-neutral-600">
          <p className="font-medium text-neutral-950">{tSupport('company.name')}</p>
          <p>{tSupport('company.street')}</p>
          <p>{tSupport('company.cityZip')}</p>
          <p>{tSupport('company.kvk')}</p>
          <p>{tSupport('company.phone')}</p>
        </div>
      </div>
    </section>
  );
}

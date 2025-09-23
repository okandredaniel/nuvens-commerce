import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SupportHours() {
  const { t: tSupport } = useTranslation('support');

  return (
    <section className="rounded-xl border border-neutral-200 bg-primary-600/10">
      <div className="p-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="rounded-xl bg-primary-600/10 p-2">
            <Clock className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-950">{tSupport('hours.title')}</h3>
        </div>
        <p className="mb-2 text-lg text-neutral-600">{tSupport('hours.value')}</p>
        <span className="inline-block rounded-full bg-primary-600 px-3 py-1 text-sm font-medium text-white">
          {tSupport('sla.response')}
        </span>
      </div>
    </section>
  );
}

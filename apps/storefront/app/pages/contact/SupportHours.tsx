import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function SupportHours() {
  const { t: tSupport } = useTranslation('support');

  return (
    <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-muted)]/10">
      <div className="p-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-[color:var(--color-primary)]/10">
            <Clock className="w-6 h-6 text-[color:var(--color-primary)]" />
          </div>
          <h3 className="font-semibold text-xl text-[color:var(--color-on-surface)]">
            {tSupport('hours.title')}
          </h3>
        </div>
        <p className="text-lg text-[color:var(--color-muted)] mb-2">{tSupport('hours.value')}</p>
        <span className="inline-block rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] px-3 py-1 text-sm font-medium">
          {tSupport('sla.response')}
        </span>
      </div>
    </section>
  );
}

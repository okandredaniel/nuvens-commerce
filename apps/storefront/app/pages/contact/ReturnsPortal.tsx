import { Button } from '@nuvens/ui';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ReturnsPortal() {
  const { t: tSupport } = useTranslation('support');
  const href = tSupport('returns.portal.href') || '';

  return (
    <section className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-2xl">
      <div className="px-5 pt-5 pb-6">
        <h3 className="flex items-center gap-3 text-xl text-[color:var(--color-on-surface)]">
          <span className="p-2 rounded-lg bg-[color:var(--color-primary)]/10">
            <RefreshCw className="w-6 h-6 text-[color:var(--color-primary)]" />
          </span>
          {tSupport('returns.title')}
        </h3>
      </div>
      <div className="px-5 pb-5 space-y-6">
        <p className="text-[color:var(--color-muted)] leading-relaxed">
          {tSupport('returns.desc')}
        </p>
        {href ? (
          <Button asChild variant="outline" className="w-full py-3">
            <a href={href}>
              <RefreshCw className="w-5 h-5 mr-3" />
              {tSupport('returns.cta')}
            </a>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

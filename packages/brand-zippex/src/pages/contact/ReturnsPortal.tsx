import { Button } from '@nuvens/ui';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ReturnsPortal() {
  const { t: tSupport } = useTranslation('support');
  const href = tSupport('returns.portal.href') || '';

  return (
    <section className="rounded-xl border border-neutral-200 bg-white">
      <div className="px-5 pb-6 pt-5">
        <h3 className="flex items-center gap-3 text-xl text-neutral-950">
          <span className="rounded-xl bg-primary-600/10 p-2">
            <RefreshCw className="h-6 w-6 text-primary-600" />
          </span>
          {tSupport('returns.title')}
        </h3>
      </div>
      <div className="space-y-6 px-5 pb-5">
        <p className="leading-relaxed text-neutral-600">{tSupport('returns.desc')}</p>
        {href ? (
          <Button asChild variant="outline" className="w-full py-3">
            <a href={href}>
              <RefreshCw className="mr-3 h-5 w-5" />
              {tSupport('returns.cta')}
            </a>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

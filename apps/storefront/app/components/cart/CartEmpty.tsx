import { useRoutingPolicy } from '@/providers/AppContexts';
import { Button, useAside } from '@nuvens/ui';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

export function CartEmpty() {
  const { t } = useTranslation('cart');
  const { close } = useAside();
  const { pathname } = useLocation();
  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const prefix = /^[A-Za-z]{2}-[A-Za-z]{2}$/.test(seg) ? `/${seg.toLowerCase()}` : '';
  const { recommendedFallback } = useRoutingPolicy();
  const to = `${prefix}${recommendedFallback}`;

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8 text-center">
      <h2 className="text-lg font-semibold">{t('empty.title')}</h2>
      <p className="mt-2 text-sm opacity-70">{t('empty.body')}</p>
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link to={to} prefetch="viewport" onClick={close}>
            {t('empty.cta')}
          </Link>
        </Button>
      </div>
    </div>
  );
}

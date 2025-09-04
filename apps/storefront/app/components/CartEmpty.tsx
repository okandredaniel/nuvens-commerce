import { Button, useAside } from '@nuvens/ui-core';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

export function CartEmpty() {
  const { t } = useTranslation('cart');
  const { close } = useAside();
  const { pathname } = useLocation();
  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const prefix = /^[A-Za-z]{2}-[A-Za-z]{2}$/.test(seg) ? `/${seg.toLowerCase()}` : '';
  const to = `${prefix}/collections`;

  return (
    <div className="rounded-2xl border border-[color:var(--color-border,#e5e7eb)] bg-[color:var(--color-surface,#fff)] p-8 text-center">
      <h2 className="text-lg font-semibold">{t('empty.title', 'Your cart is empty')}</h2>
      <p className="mt-2 text-sm opacity-70">
        {t('empty.body', 'Browse our collections and find something you love.')}
      </p>
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link to={to} prefetch="viewport" onClick={close}>
            {t('empty.cta', 'Continue shopping')}
          </Link>
        </Button>
      </div>
    </div>
  );
}

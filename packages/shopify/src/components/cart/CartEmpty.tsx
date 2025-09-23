import { Button, useAside } from '@nuvens/ui';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';

export function CartEmpty({ fallback }: { fallback: string }) {
  const { t } = useTranslation('cart');
  const { close } = useAside();
  const { pathname } = useLocation();
  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const prefix = /^[A-Za-z]{2}-[A-Za-z]{2}$/.test(seg) ? `/${seg.toLowerCase()}` : '';
  const to = `${prefix}${fallback}`;

  return (
    <div className="m-auto p-8 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full border border-neutral-200 bg-neutral-0">
        <ShoppingCart className="h-6 w-6 text-neutral-400" aria-hidden />
      </div>

      <h2 className="text-lg font-semibold text-neutral-900">{t('empty.title')}</h2>
      <p className="mt-2 text-sm text-neutral-600">{t('empty.body')}</p>

      <ul className="mt-3 flex list-none flex-col items-center gap-1 text-xs text-neutral-600">
        <li>{t('empty.benefit_easy_returns')}</li>
        <li>{t('empty.benefit_secure_checkout')}</li>
      </ul>

      <div className="mt-6">
        <Button size="lg" asChild>
          <Link to={to} prefetch="viewport" onClick={close}>
            {t('empty.cta')}
          </Link>
        </Button>
      </div>
    </div>
  );
}

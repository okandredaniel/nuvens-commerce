import { RatingStars } from '@nuvens/ui';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  rating: number;
  count?: number | null;
  hrefAllReviews?: string;
};

export default function ProductRating({ rating, count = null, hrefAllReviews }: Props) {
  const { t } = useTranslation('product');
  const safe = Number.isFinite(rating) ? Math.min(Math.max(rating, 0), 5) : 0;
  const percent = useMemo(() => Math.round((safe / 5) * 100), [safe]);
  const aria = t('rating.aria', { value: safe.toFixed(1) });

  return (
    <div className="flex items-center gap-3" aria-label={aria}>
      <RatingStars value={safe} />
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold tracking-tight text-neutral-900">
          {safe.toFixed(1)}
        </span>
        {typeof count === 'number' ? (
          <span className="text-sm text-neutral-600">({count})</span>
        ) : null}
        {hrefAllReviews ? (
          <a
            href={hrefAllReviews}
            className="rounded-xl text-sm font-medium text-primary-700 underline-offset-2 hover:text-primary-800 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0"
            title={t('rating.see_all')}
          >
            {t('rating.see_all')}
          </a>
        ) : null}
      </div>
    </div>
  );
}

import { Star } from 'lucide-react';
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
      <div className="relative">
        <div className="w-[120px] inset-0 flex text-neutral-200 z-0" aria-hidden="true">
          <Star className="fill-current stroke-0" />
          <Star className="fill-current stroke-0" />
          <Star className="fill-current stroke-0" />
          <Star className="fill-current stroke-0" />
          <Star className="fill-current stroke-0" />
        </div>
        <div
          className="absolute pointer-events-none inset-0 overflow-hidden z-10"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        >
          <div className="flex text-warning-400 w-[120px]">
            <Star className="fill-current stroke-0" />
            <Star className="fill-current stroke-0" />
            <Star className="fill-current stroke-0" />
            <Star className="fill-current stroke-0" />
            <Star className="fill-current stroke-0" />
          </div>
        </div>
      </div>

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
            className="rounded-sm text-sm font-medium text-primary-700 underline-offset-2 hover:text-primary-800 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0"
            title={t('rating.see_all')}
          >
            {t('rating.see_all')}
          </a>
        ) : null}
      </div>
    </div>
  );
}

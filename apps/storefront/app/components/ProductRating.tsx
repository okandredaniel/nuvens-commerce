import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  rating: number;
  count?: number | null;
  hrefAllReviews?: string;
};

export default function ProductRating({ rating, count = null, hrefAllReviews }: Props) {
  const { t } = useTranslation('product');
  const safeRating = Number.isFinite(rating) ? Math.min(Math.max(rating, 0), 5) : 0;
  const percent = useMemo(() => Math.round((safeRating / 5) * 100), [safeRating]);
  const aria = t('rating.aria', {
    defaultValue: '{{value}} out of 5',
    value: safeRating.toFixed(1),
  });

  return (
    <div className="flex items-center gap-3" aria-label={aria}>
      <div className="relative">
        <div className="flex text-neutral-200" aria-hidden="true">
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </div>
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ width: `${percent}%` }}
          aria-hidden="true"
        >
          <div className="flex text-warning-400">
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold tracking-tight text-neutral-900">
          {safeRating.toFixed(1)}
        </span>
        {typeof count === 'number' ? (
          <span className="text-sm text-neutral-600">({count})</span>
        ) : null}
        {hrefAllReviews ? (
          <a
            href={hrefAllReviews}
            className="rounded-sm text-sm font-medium text-primary-700 underline-offset-2 hover:text-primary-800 hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0"
          >
            {t('rating.see_all', { defaultValue: 'See all reviews' })}
          </a>
        ) : null}
      </div>
    </div>
  );
}

function Star() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.78L10 14.9l-5.2 2.6.99-5.78L1.58 7.62l5.82-.85L10 1.5z" />
    </svg>
  );
}

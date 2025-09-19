import { Star } from 'lucide-react';
import { useMemo } from 'react';

type RatingStarsProps = {
  value: number;
  className?: string;
  ariaLabel?: string;
};

export function RatingStars({ value, className, ariaLabel }: RatingStarsProps) {
  const safe = Number.isFinite(value) ? Math.min(Math.max(value, 0), 5) : 0;
  const percent = useMemo(() => Math.round((safe / 5) * 100), [safe]);

  return (
    <div className={['relative', className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      <div className="w-[120px] inset-0 flex text-warning-400 z-0" aria-hidden="true">
        <Star className="stroke-1" />
        <Star className="stroke-1" />
        <Star className="stroke-1" />
        <Star className="stroke-1" />
        <Star className="stroke-1" />
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
  );
}

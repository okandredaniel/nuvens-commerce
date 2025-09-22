import { Minus, Plus } from 'lucide-react';
import { forwardRef } from 'react';
import type { Size, Variant } from '../../interfaces/ui.interface';
import { cn } from '../../utils/cn';
import { Button } from './Button';

type StepperProps = {
  value: number;
  min?: number;
  max?: number;
  onChange?: (v: number) => void;
  onDecrement?: () => void;
  onIncrement?: () => void;
  decDisabled?: boolean;
  incDisabled?: boolean;
  size?: Size;
  className?: string;
  decreaseLabel?: string;
  increaseLabel?: string;
  buttonVariant?: Variant;
};

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  {
    value,
    min = 0,
    max = 999,
    onChange,
    onDecrement,
    onIncrement,
    decDisabled,
    incDisabled,
    size,
    className,
    decreaseLabel = 'Decrease',
    increaseLabel = 'Increase',
    buttonVariant = 'ghost',
  },
  ref,
) {
  const dec = () => (onDecrement ? onDecrement() : onChange?.(Math.max(min, value - 1)));
  const inc = () => (onIncrement ? onIncrement() : onChange?.(Math.min(max, value + 1)));
  const s: Size = size ?? 'md';
  const iconSize = s === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const heights: Record<Size, string> = {
    sm: 'ui-form-elements-height-sm',
    md: 'ui-form-elements-height',
    lg: 'ui-form-elements-height-lg',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center ui-radius bg-neutral-0 text-neutral-900 ring-1 ring-neutral-200',
        heights[s],
        className,
      )}
    >
      <Button
        onClick={dec}
        aria-label={decreaseLabel}
        disabled={decDisabled}
        size={s}
        variant={buttonVariant}
        className="hover:bg-neutral-50"
      >
        <Minus className={iconSize} />
      </Button>

      <div className="min-w-10 px-2 text-center text-sm tabular-nums">{value}</div>

      <Button
        onClick={inc}
        aria-label={increaseLabel}
        disabled={incDisabled}
        size={s}
        variant={buttonVariant}
        className="hover:bg-neutral-50"
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  );
});

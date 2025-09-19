import { Minus, Plus } from 'lucide-react';
import { forwardRef } from 'react';
import type { ButtonVariant, Size } from '../../interfaces/ui.interface';
import { cn } from '../../utils/cn';
import { IconButton } from './IconButton';

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
  buttonVariant?: ButtonVariant;
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
  const heights: Record<Size, string> = { sm: 'h-9', md: 'h-10', lg: 'h-11' };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-lg bg-neutral-0 text-neutral-900 ring-1 ring-neutral-200',
        size === 'sm' ? 'px-[2px]' : '',
        heights[s],
        className,
      )}
    >
      <IconButton
        onClick={dec}
        aria-label={decreaseLabel}
        disabled={decDisabled}
        size={s}
        variant={buttonVariant}
        className="hover:bg-neutral-50"
      >
        <Minus className={iconSize} />
      </IconButton>

      <div className="min-w-10 px-2 text-center text-sm tabular-nums">{value}</div>

      <IconButton
        onClick={inc}
        aria-label={increaseLabel}
        disabled={incDisabled}
        size={s}
        variant={buttonVariant}
        className="hover:bg-neutral-50"
      >
        <Plus className={iconSize} />
      </IconButton>
    </div>
  );
});

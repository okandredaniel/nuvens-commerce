import { Minus, Plus } from 'lucide-react';
import { forwardRef } from 'react';
import type { ButtonVariant, ControlSize } from '../../interfaces';
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
  size?: Extract<ControlSize, 'sm' | 'md'>;
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
    size = 'md',
    className,
    decreaseLabel = 'Decrease',
    increaseLabel = 'Increase',
    buttonVariant = 'ghost',
  },
  ref,
) {
  const dec = () => (onDecrement ? onDecrement() : onChange?.(Math.max(min, value - 1)));
  const inc = () => (onIncrement ? onIncrement() : onChange?.(Math.min(max, value + 1)));
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border border-[color:var(--color-border)]',
        'bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)] p-1',
        className,
      )}
    >
      <IconButton
        onClick={dec}
        aria-label={decreaseLabel}
        disabled={decDisabled}
        size={size === 'sm' ? 'sm' : 'md'}
        variant={buttonVariant}
      >
        <Minus className={iconSize} />
      </IconButton>
      <div className="min-w-10 px-2 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </div>
      <IconButton
        onClick={inc}
        aria-label={increaseLabel}
        disabled={incDisabled}
        size={size === 'sm' ? 'sm' : 'md'}
        variant={buttonVariant}
      >
        <Plus className={iconSize} />
      </IconButton>
    </div>
  );
});

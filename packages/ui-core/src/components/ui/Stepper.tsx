import { Minus, Plus } from 'lucide-react';
import { forwardRef } from 'react';
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
  size?: 'sm' | 'md';
  className?: string;
  decreaseLabel?: string;
  increaseLabel?: string;
  buttonVariant?: 'ghost' | 'default';
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
  const dec = () => {
    if (onDecrement) return onDecrement();
    if (onChange) onChange(Math.max(min, value - 1));
  };
  const inc = () => {
    if (onIncrement) return onIncrement();
    if (onChange) onChange(Math.min(max, value + 1));
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center p-1 rounded-full border border-[color:var(--color-border,#e5e7eb)] bg-[color:var(--color-surface,#fff)]',
        className,
      )}
    >
      <IconButton
        onClick={dec}
        aria-label={decreaseLabel}
        disabled={decDisabled}
        size={size === 'sm' ? 'sm' : 'md'}
        variant="ghost"
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
        variant="ghost"
      >
        <Plus className={iconSize} />
      </IconButton>
    </div>
  );
});

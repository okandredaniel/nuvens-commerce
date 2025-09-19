import { forwardRef } from 'react';
import type { Size } from '../../interfaces/ui.interface';
import { cn } from '../../utils/cn';

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: Size;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, ...props },
  ref,
) {
  const base =
    'w-full ui-radius border border-neutral-200 bg-neutral-0 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-neutral-0 transition';
  const sizes: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-3 text-sm',
    lg: 'h-11 px-4 text-base',
  };
  const s: Size = size ?? 'md';

  return <input ref={ref} className={cn(base, sizes[s], className)} {...props} />;
});

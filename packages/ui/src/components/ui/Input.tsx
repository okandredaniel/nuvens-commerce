import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  const base =
    'h-10 w-full rounded-lg border border-neutral-200 bg-neutral-0 px-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-neutral-0 transition';

  return <input ref={ref} className={cn(base, className)} {...props} />;
});

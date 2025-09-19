import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { ButtonVariant, Size } from '../../interfaces/ui.interface';
import { cn } from '../../utils/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: Size;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { className, variant = 'outline', size = 'md', ...props },
  ref,
) {
  const sizes: Record<Size, string> = {
    sm: 'h-8 w-8 text-[13px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-11 w-11 text-sm',
  };

  const variants: Record<ButtonVariant, string> = {
    outline: 'border border-neutral-300 bg-neutral-0/10 hover:bg-neutral-0/20 transition',
    ghost: 'bg-transparent hover:bg-neutral-100 transition',
    solid: 'bg-neutral-0 border border-neutral-200 hover:bg-neutral-50 transition',
  };

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 ui-radius outline-none text-inherit',
        'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
        'disabled:opacity-50 disabled:pointer-events-none',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});

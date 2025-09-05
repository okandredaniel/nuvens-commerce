import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { ButtonVariant, ControlSize } from '../../interfaces';
import { cn } from '../../utils/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ControlSize;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { className, variant = 'ghost', size = 'md', ...props },
  ref,
) {
  const sizes: Record<ControlSize, string> = {
    sm: 'h-8 w-8 text-[13px]',
    md: 'h-10 w-10 text-[14px]',
    lg: 'h-12 w-12 text-[15px]',
  };

  const variants: Record<ButtonVariant, string> = {
    solid:
      'bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-black/5',
    outline: 'bg-transparent border border-[color:var(--color-border)] hover:bg-black/5',
    ghost: 'bg-transparent hover:bg-black/5',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-grid place-items-center rounded-full transition outline-none text-inherit',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});

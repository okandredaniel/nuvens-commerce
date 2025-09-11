import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import type { ButtonVariant, ControlSize } from '../../interfaces/ui.interface';
import { cn } from '../../utils/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ControlSize;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { className, variant = 'outline', size = 'md', ...props },
  ref,
) {
  const sizes: Record<ControlSize, string> = {
    sm: 'h-8 w-8 text-[13px]',
    md: 'h-10 w-10 text-xs',
    lg: 'h-12 w-12 text-sm',
  };

  const variants: Record<ButtonVariant, string> = {
    outline: 'border border-zinc-300 bg-white/10 hover:bg-white/20 transition',
    ghost: 'bg-transparent hover:bg-black/5 transition',
    solid:
      'bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-black/5 transition',
  };

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full outline-none text-inherit',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});

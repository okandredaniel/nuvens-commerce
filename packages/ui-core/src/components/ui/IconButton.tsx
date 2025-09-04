import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'solid' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { className, variant = 'ghost', size = 'md', ...props },
  ref,
) {
  const sizes: Record<Size, string> = {
    sm: 'h-8 w-8 text-[13px]',
    md: 'h-10 w-10 text-[14px]',
    lg: 'h-12 w-12 text-[15px]',
  };

  const variants: Record<Variant, string> = {
    solid:
      'bg-[color:var(--color-surface,#fff)] border border-[color:var(--color-border,#e5e7eb)] hover:bg-black/5',
    outline: 'bg-transparent border border-[color:var(--color-border,#e5e7eb)] hover:bg-black/5',
    ghost: 'bg-transparent hover:bg-black/5',
  };

  return (
    <button
      ref={ref}
      className={cn(
        // herdamos a cor do contexto
        'inline-grid place-items-center rounded-full transition outline-none text-inherit',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary,#2563eb)] focus-visible:ring-offset-2',
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});

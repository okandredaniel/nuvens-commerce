import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg';
  intent?: 'default' | 'ghost';
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { className, size = 'md', intent = 'ghost', ...props },
  ref,
) {
  const sizes = {
    sm: 'h-8 w-8 text-[13px]',
    md: 'h-10 w-10 text-[14px]',
    lg: 'h-12 w-12 text-[15px]',
  }[size];

  const intents = {
    default:
      'bg-[color:var(--color-header,#fff)] text-[color:var(--color-on-header,#111)] border border-[color:var(--color-border,#e5e7eb)] hover:bg-black/5',
    ghost:
      'bg-transparent text-[color:var(--color-on-header,#111)] border border-[color:var(--color-border,#e5e7eb)] hover:bg-black/5',
  }[intent];

  return (
    <button
      ref={ref}
      className={cn(
        'inline-grid place-items-center rounded-full transition outline-none',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary,#2563eb)] focus-visible:ring-offset-2',
        sizes,
        intents,
        className,
      )}
      {...props}
    />
  );
});

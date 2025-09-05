import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center rounded-lg font-semibold transition text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-[color:var(--color-primary,#111)] text-[color:var(--color-on-primary,#fff)] hover:opacity-90 focus-visible:ring-[color:var(--color-primary,#111)]',
  ghost: 'bg-transparent hover:bg-black/5 focus-visible:ring-[color:var(--color-border,#e5e7eb)]',
  outline:
    'border border-[color:var(--color-border,#e5e7eb)] bg-[color:var(--color-surface,#fff)] hover:bg-black/5 focus-visible:ring-[color:var(--color-border,#e5e7eb)]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', asChild, type, ...props },
  ref,
) {
  const Comp: any = asChild ? Slot : 'button';
  const merged = cn(base, variants[variant], sizes[size], className);
  const finalType = !asChild ? type || 'button' : undefined;
  return <Comp ref={ref} className={merged} type={finalType} {...props} />;
});

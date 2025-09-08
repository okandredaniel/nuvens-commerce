import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md';

const base =
  'inline-flex items-center justify-center rounded-lg font-semibold transition text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] hover:opacity-90 focus-visible:ring-[color:var(--color-primary)]',
  ghost: 'bg-transparent hover:bg-black/5 focus-visible:ring-[color:var(--color-border)]',
  outline:
    'border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-black/5 focus-visible:ring-[color:var(--color-border)]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  className?: string;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ className, variant = 'primary', size = 'md', asChild, type, ...props }, ref) {
    const isLink = typeof (props as any).href === 'string';
    const Comp: any = asChild ? Slot : isLink ? 'a' : 'button';
    const merged = cn(base, variants[variant], sizes[size], className);
    const finalType = !asChild && !isLink ? type || 'button' : undefined;
    return <Comp ref={ref as any} className={merged} type={finalType} {...(props as any)} />;
  },
);

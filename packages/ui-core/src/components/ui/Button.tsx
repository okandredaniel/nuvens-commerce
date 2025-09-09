import { Slot } from '@radix-ui/react-slot';
import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'ghost' | 'outline' | 'white';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center font-semibold transition text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[var(--shape-button-radius)]';

const variants: Record<Variant, string> = {
  primary:
    'bg-[color:var(--color-primary)] text-[color:var(--color-on-primary)] hover:opacity-90 focus-visible:ring-[color:var(--color-primary)]',
  ghost: 'bg-transparent hover:bg-black/5 focus-visible:ring-[color:var(--color-border)]',
  outline:
    'border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-black/5 focus-visible:ring-[color:var(--color-border)]',
  white:
    'bg-white text-black hover:bg-white/90 focus-visible:ring-white focus-visible:ring-offset-black/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  className?: string;
};

type PolymorphicProps<E extends React.ElementType> = CommonProps &
  Omit<React.ComponentPropsWithoutRef<E>, 'size' | 'color' | 'className'> & {
    as?: E;
  };

type ButtonComponent = <E extends React.ElementType = 'button'>(
  props: PolymorphicProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null;

function hasHref(x: unknown): x is { href: string } {
  return !!x && typeof (x as any).href === 'string';
}

export const Button = forwardRef(function Button<E extends React.ElementType = 'button'>(
  props: PolymorphicProps<E>,
  ref: React.ForwardedRef<Element>,
) {
  const {
    as,
    asChild,
    className,
    variant = 'primary',
    size = 'md',
    type,
    rel,
    target,
    ...rest
  } = props;

  let Comp: React.ElementType = 'button';
  if (asChild) Comp = Slot;
  else if (as) Comp = as;
  else if (hasHref(rest)) Comp = 'a';

  const merged = cn(base, variants[variant], sizes[size], className);
  const isNativeButton = !asChild && (Comp === 'button' || as === 'button');
  const finalType = isNativeButton ? (type ?? 'button') : undefined;
  const finalRel = target === '_blank' && !rel ? 'noopener noreferrer' : rel;

  return (
    <Comp ref={ref as any} className={merged} type={finalType} rel={finalRel} {...(rest as any)} />
  );
}) as ButtonComponent;

import { Slot } from '@radix-ui/react-slot';
import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'ghost' | 'outline' | 'white';
type Size = 'sm' | 'md' | 'lg';

const base =
  'no-underline inline-flex items-center justify-center font-semibold transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-primary-600 ring-offset-neutral-0 ' +
  'disabled:opacity-50 disabled:pointer-events-none rounded-lg text-neutral-900';

const variants: Record<Variant, string> = {
  primary: 'bg-primary-600 text-neutral-0 hover:bg-primary-700',
  ghost: 'bg-transparent hover:bg-neutral-100',
  outline: 'border border-neutral-300 bg-neutral-0/0 hover:bg-neutral-0/10',
  white: 'bg-neutral-0 border border-neutral-200 hover:bg-neutral-50',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-5 text-sm',
  lg: 'h-11 px-6 text-base',
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

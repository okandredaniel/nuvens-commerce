import { Slot } from '@radix-ui/react-slot';
import React, { forwardRef } from 'react';
import type { Size } from '../../interfaces/ui.interface';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'white' | 'outline';

const base =
  'inline-flex items-center justify-center font-semibold rounded-lg transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border-neutral-0/0' +
  'focus-visible:ring-primary-600 ring-offset-neutral-0 border text no-underline ' +
  'disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-primary-600 text-neutral-0 hover:bg-primary-700',
  secondary: 'bg-neutral-400 text-neutral-0 hover:bg-neutral-500',
  white: 'bg-neutral-0 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-600',
  outline: ' border-neutral-300 bg-neutral-0 hover:bg-neutral-50',
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
  disabled?: boolean;
};

type PolymorphicProps<E extends React.ElementType> = CommonProps &
  Omit<React.ComponentPropsWithoutRef<E>, 'size' | 'color' | 'className' | 'disabled'> & {
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
    size,
    type,
    rel,
    target,
    disabled,
    onClick,
    ...rest
  } = props as PolymorphicProps<E> & { disabled?: boolean; onClick?: React.MouseEventHandler };

  let Comp: React.ElementType = 'button';
  if (asChild) Comp = Slot;
  else if (as) Comp = as;
  else if (hasHref(rest)) Comp = 'a';

  const s: Size = size ?? 'md';
  const merged = cn(base, variants[variant], sizes[s], className);
  const isNativeButton = !asChild && (Comp === 'button' || as === 'button');
  const finalType = isNativeButton ? (type ?? 'button') : undefined;
  const finalRel = target === '_blank' && !rel ? 'noopener noreferrer' : rel;

  const handleClick: React.MouseEventHandler = (e) => {
    if (disabled && !isNativeButton) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  return (
    <Comp
      ref={ref as any}
      className={merged}
      type={finalType}
      rel={finalRel}
      aria-disabled={!isNativeButton && disabled ? true : undefined}
      tabIndex={!isNativeButton && disabled ? -1 : undefined}
      disabled={isNativeButton ? disabled : undefined}
      onClick={handleClick}
      {...(rest as any)}
    />
  );
}) as ButtonComponent;

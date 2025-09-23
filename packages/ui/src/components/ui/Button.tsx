import { Slot } from '@radix-ui/react-slot';
import React, { forwardRef } from 'react';
import type { Size, Surface, Variant } from '../../interfaces/ui.interface';
import { cn } from '../../utils/cn';

const base = cn(
  'inline-flex items-center justify-center font-semibold ui-radius transition',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  'focus-visible:ring-primary-600 ring-offset-neutral-0 border border-transparent text no-underline',
  'disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none',
);

const variantsDefault: Record<Variant, string> = {
  primary: 'bg-primary-600 text-neutral-0 hover:bg-primary-700',
  secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300',
  outline: 'border-neutral-600/20 bg-primary-600/5 hover:bg-primary-600/10 text-neutral-900',
  ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-900',
};

const variantsOnDark: Record<Variant, string> = {
  primary: 'bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-600',
  secondary: 'bg-neutral-50 text-neutral-900 hover:bg-neutral-50',
  outline: 'border-neutral-50/20 bg-neutral-50/10 hover:bg-neutral-50/20 text-neutral-0',
  ghost: 'bg-transparent hover:bg-neutral-50/10 text-neutral-0',
};

const sizes: Record<Size, string> = {
  sm: 'ui-form-elements-height-sm px-3 text-sm',
  md: 'ui-form-elements-height px-5 text-sm',
  lg: 'ui-form-elements-height-lg px-6 text-base',
};

const iconSizes: Record<Size, string> = {
  sm: 'ui-form-elements-height-sm aspect-square p-0 text-sm',
  md: 'ui-form-elements-height aspect-square p-0 text-sm',
  lg: 'ui-form-elements-height-lg aspect-square p-0 text-base',
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  surface?: Surface;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  icon?: boolean;
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
    size,
    type,
    rel,
    target,
    disabled,
    onClick,
    icon,
    variant = 'primary',
    surface = 'light',
    ...rest
  } = props as PolymorphicProps<E> & {
    disabled?: boolean;
    onClick?: React.MouseEventHandler;
    icon?: boolean;
  };

  let Comp: React.ElementType = 'button';
  if (asChild) Comp = Slot;
  else if (as) Comp = as;
  else if (hasHref(rest)) Comp = 'a';

  const s: Size = size ?? 'md';
  const sizeClasses = icon ? iconSizes[s] : sizes[s];
  const toneClasses = surface === 'dark' ? variantsOnDark[variant] : variantsDefault[variant];
  const merged = cn(base, toneClasses, sizeClasses, className);
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

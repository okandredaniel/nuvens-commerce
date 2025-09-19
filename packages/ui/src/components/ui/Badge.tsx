import { Slot } from '@radix-ui/react-slot';
import React from 'react';
import { cn } from '../../utils/cn';

type Variant = 'neutral' | 'brand' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full border font-medium align-middle';

const variants: Record<Variant, string> = {
  neutral: 'bg-neutral-0 border-neutral-200 text-neutral-600',
  brand: 'bg-primary-600/10 border-primary-200 text-primary-700',
  outline: 'border border-neutral-300/50 bg-neutral-0/0 hover:bg-neutral-0/10 text-neutral-700',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

type BadgeOwnProps = {
  asChild?: boolean;
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
};

type BadgeProps<E extends React.ElementType = 'span'> = BadgeOwnProps & { as?: E } & Omit<
    React.ComponentPropsWithoutRef<E>,
    'className' | 'color' | 'size' | 'as' | 'children'
  >;

type BadgeComponent = <E extends React.ElementType = 'span'>(
  props: BadgeProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null;

export const Badge = React.forwardRef(function Badge<E extends React.ElementType = 'span'>(
  props: BadgeProps<E>,
  ref: React.ForwardedRef<Element>,
) {
  const { as, asChild, className, children, variant = 'neutral', size = 'md', ...rest } = props;
  const Comp: React.ElementType = asChild ? Slot : as || 'span';
  return (
    <Comp
      ref={ref as any}
      className={cn(base, variants[variant], sizes[size], className)}
      {...(rest as any)}
    >
      {children}
    </Comp>
  );
}) as BadgeComponent;

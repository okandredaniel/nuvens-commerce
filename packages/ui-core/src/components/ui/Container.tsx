import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

const sizeClass: Record<Size, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '3xl': 'max-w-[88rem]',
  full: 'max-w-none',
};

type Props<T extends ElementType> = {
  as?: T;
  size?: Size;
  fluid?: boolean;
  className?: string;
} & HTMLAttributes<HTMLElement>;

export const Container = forwardRef<HTMLElement, Props<ElementType>>(function Container(
  { as, size = '3xl', fluid, className, ...rest },
  ref,
) {
  const Comp = (as || 'div') as ElementType;
  return (
    <Comp
      ref={ref as any}
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        fluid ? sizeClass.full : sizeClass[size],
        className,
      )}
      {...rest}
    />
  );
});

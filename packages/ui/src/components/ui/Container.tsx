import { forwardRef, type ElementType } from 'react';
import { cn } from '../../utils/cn';

type Props = {
  as?: ElementType;
  className?: string;
} & React.HTMLAttributes<HTMLElement>;

export const Container = forwardRef<HTMLElement, Props>(function Container(
  { as, className, ...rest },
  ref,
) {
  const Comp = (as || 'div') as ElementType;
  return (
    <Comp
      ref={ref as any}
      className={cn('container mx-auto px-4 sm:px-6 lg:px-8', className)}
      {...rest}
    />
  );
});

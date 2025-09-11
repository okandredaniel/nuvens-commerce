import * as RadixLabel from '@radix-ui/react-label';
import * as React from 'react';
import { cn } from '../../utils/cn';

export type LabelProps = React.ComponentPropsWithoutRef<typeof RadixLabel.Root>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return <RadixLabel.Root ref={ref} className={cn('text-sm font-medium', className)} {...props} />;
});

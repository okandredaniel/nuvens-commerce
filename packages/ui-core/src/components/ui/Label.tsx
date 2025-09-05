import * as RadixLabel from '@radix-ui/react-label';
import * as React from 'react';

export type LabelProps = React.ComponentPropsWithoutRef<typeof RadixLabel.Root>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...p },
  r,
) {
  return (
    <RadixLabel.Root
      ref={r}
      className={`text-sm font-medium text-[color:var(--color-text)] ${className || ''}`}
      {...p}
    />
  );
});

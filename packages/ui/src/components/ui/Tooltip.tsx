import * as RT from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Provider = RT.Provider;
export const Root = RT.Root;
export const Trigger = RT.Trigger;
export const Portal = RT.Portal;

export const Content = forwardRef<HTMLDivElement, RT.TooltipContentProps>(function Content(
  { className, sideOffset = 8, ...props },
  ref,
) {
  return (
    <RT.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 rounded-lg border border-neutral-200 bg-neutral-0 px-2 py-1 text-xs text-neutral-900 shadow-md outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        className,
      )}
      {...props}
    />
  );
});

export const Arrow = RT.Arrow;

export const Tooltip = {
  Provider,
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
};

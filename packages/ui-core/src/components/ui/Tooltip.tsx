import * as RT from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Provider = RT.Provider;
export const Root = RT.Root;
export const Trigger = RT.Trigger;

export const Content = forwardRef<HTMLDivElement, RT.TooltipContentProps>(function Content(
  { className, sideOffset = 8, ...props },
  ref,
) {
  return (
    <RT.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'rounded-lg border border-[color:var(--color-border,#e5e7eb)]',
        'bg-[color:var(--color-surface,#fff)] text-[color:var(--color-on-surface,#111)]',
        'px-2 py-1 text-xs shadow-md',
        className,
      )}
      {...props}
    />
  );
});

export const Arrow = RT.Arrow;

export const Tooltip = { Provider, Root, Trigger, Content, Arrow };

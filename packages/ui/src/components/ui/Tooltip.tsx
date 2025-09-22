import * as RT from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Provider = RT.Provider;
export const Root = RT.Root;
export const Trigger = RT.Trigger;
export const Portal = RT.Portal;

type ContentProps = RT.TooltipContentProps & {
  variant?: 'default' | 'inverted';
};

export const Content = forwardRef<HTMLDivElement, ContentProps>(function Content(
  {
    className,
    sideOffset = 8,
    collisionPadding = 8,
    variant = 'default',
    children,
    side,
    ...props
  },
  ref,
) {
  const inverted = variant === 'inverted';
  const tone = inverted
    ? {
        box: 'border-neutral-800 bg-neutral-900 text-neutral-0 shadow-lg',
        fill: 'fill-neutral-900',
        border: 'fill-neutral-900 stroke-neutral-800',
      }
    : {
        box: 'border-neutral-200 bg-neutral-0 text-neutral-900 shadow-md',
        fill: 'fill-neutral-0',
        border: 'fill-neutral-0 stroke-neutral-200',
      };

  const join =
    'group-data-[side=top]/tt:-mb-px group-data-[side=bottom]/tt:-mt-px group-data-[side=left]/tt:-mr-px group-data-[side=right]/tt:-ml-px';

  return (
    <RT.Content
      ref={ref}
      side={side}
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      avoidCollisions
      align="center"
      data-side={side}
      className={cn(
        'group/tt ui-radius z-50 max-w-xs border px-2.5 py-1.5 text-xs outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0',
        'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
        'data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
        tone.box,
        className,
      )}
      {...props}
    >
      {children}
      <RT.Arrow
        className={cn('pointer-events-none relative z-10', tone.fill, join)}
        width={12}
        height={8}
      />
    </RT.Content>
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

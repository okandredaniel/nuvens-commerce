import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuTriggerProps,
} from '@radix-ui/react-dropdown-menu';
import * as RM from '@radix-ui/react-dropdown-menu';
import { motion, useReducedMotion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Root = RM.Root;

export const Trigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(function Trigger(
  { className, ...props },
  ref,
) {
  return <RM.Trigger ref={ref} className={className} {...props} />;
});

export const Portal = RM.Portal;

export const Content = forwardRef<HTMLDivElement, DropdownMenuContentProps>(function Content(
  { className, sideOffset = 8, children, ...props },
  ref,
) {
  const rm = useReducedMotion();
  return (
    <RM.Portal>
      <RM.Content ref={ref} sideOffset={sideOffset} asChild {...props}>
        <motion.div
          initial={rm ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: rm ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] as const }}
          className={cn(
            'z-50 min-w-44 rounded-xl border border-neutral-200 bg-neutral-0 p-1 shadow-xl outline-none',
            className,
          )}
        >
          {children}
        </motion.div>
      </RM.Content>
    </RM.Portal>
  );
});

export const Item = forwardRef<HTMLDivElement, DropdownMenuItemProps>(function Item(
  { className, ...props },
  ref,
) {
  return (
    <RM.Item
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[highlighted]:bg-neutral-100',
        className,
      )}
      {...props}
    />
  );
});

export const Separator = forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(function Separator(
  { className, ...props },
  ref,
) {
  return (
    <RM.Separator ref={ref} className={cn('my-1 h-px bg-neutral-200', className)} {...props} />
  );
});

export const Label = forwardRef<HTMLDivElement, DropdownMenuLabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return (
    <RM.Label
      ref={ref}
      className={cn('px-3 py-2 text-xs uppercase text-neutral-600', className)}
      {...props}
    />
  );
});

export const Group = (props: DropdownMenuGroupProps) => <RM.Group {...props} />;
export const CheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  function CheckboxItem({ className, ...props }, ref) {
    return (
      <RM.CheckboxItem
        ref={ref}
        className={cn(
          'relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          'data-[highlighted]:bg-neutral-100',
          className,
        )}
        {...props}
      />
    );
  },
);
export const RadioGroup = (props: DropdownMenuRadioGroupProps) => <RM.RadioGroup {...props} />;
export const RadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(function RadioItem(
  { className, ...props },
  ref,
) {
  return (
    <RM.RadioItem
      ref={ref}
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[highlighted]:bg-neutral-100',
        className,
      )}
      {...props}
    />
  );
});

export const DropdownMenu = {
  Root,
  Trigger,
  Portal,
  Content,
  Item,
  Separator,
  Label,
  Group,
  CheckboxItem,
  RadioGroup,
  RadioItem,
};

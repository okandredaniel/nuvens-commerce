import * as RM from '@radix-ui/react-dropdown-menu';
import { forwardRef } from 'react';

export const DropdownRoot = RM.Root;

export const DropdownTrigger = forwardRef<HTMLButtonElement, RM.DropdownMenuTriggerProps>(
  function DropdownTrigger(props, ref) {
    return <RM.Trigger ref={ref} {...props} />;
  },
);

export const DropdownContent = forwardRef<HTMLDivElement, RM.DropdownMenuContentProps>(
  function DropdownContent({ className, sideOffset = 8, ...rest }, ref) {
    return (
      <RM.Portal>
        <RM.Content
          ref={ref}
          sideOffset={sideOffset}
          className={`z-50 min-w-40 rounded-xl border border-black/10 bg-[var(--color-surface)] p-1 shadow-xl data-[side=bottom]:animate-in data-[side=bottom]:slide-in-from-top-1 ${className || ''}`}
          {...rest}
        />
      </RM.Portal>
    );
  },
);

export const DropdownItem = forwardRef<HTMLDivElement, RM.DropdownMenuItemProps>(
  function DropdownItem(props, ref) {
    return (
      <RM.Item
        ref={ref}
        className={`relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-black/5 ${props.className || ''}`}
        {...props}
      />
    );
  },
);

export const DropdownSeparator = forwardRef<HTMLDivElement, RM.DropdownMenuSeparatorProps>(
  function DropdownSeparator(props, ref) {
    return (
      <RM.Separator
        ref={ref}
        className={`my-1 h-px bg-black/10 ${props.className || ''}`}
        {...props}
      />
    );
  },
);

export const DropdownLabel = forwardRef<HTMLDivElement, RM.DropdownMenuLabelProps>(
  function DropdownLabel(props, ref) {
    return (
      <RM.Label
        ref={ref}
        className={`px-3 py-2 text-xs uppercase opacity-60 ${props.className || ''}`}
        {...props}
      />
    );
  },
);

export const Dropdown = {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Separator: DropdownSeparator,
  Label: DropdownLabel,
  Group: RM.Group,
  CheckboxItem: RM.CheckboxItem,
  RadioGroup: RM.RadioGroup,
  RadioItem: RM.RadioItem,
};

import * as RM from '@radix-ui/react-dropdown-menu';

export function DropdownRoot(props: RM.DropdownMenuProps) {
  return <RM.Root {...props} />;
}

export function DropdownTrigger(props: RM.DropdownMenuTriggerProps) {
  return <RM.Trigger {...props} />;
}

export function DropdownContent({
  className,
  sideOffset = 8,
  ...rest
}: RM.DropdownMenuContentProps) {
  return (
    <RM.Portal>
      <RM.Content
        {...rest}
        sideOffset={sideOffset}
        className={`z-50 min-w-40 rounded-xl border border-black/10 bg-[var(--color-surface,#fff)] p-1 shadow-xl data-[side=bottom]:animate-in data-[side=bottom]:slide-in-from-top-1 ${className || ''}`}
      />
    </RM.Portal>
  );
}

export function DropdownItem(props: RM.DropdownMenuItemProps) {
  return (
    <RM.Item
      {...props}
      className={`relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-black/5 ${props.className || ''}`}
    />
  );
}

export function DropdownSeparator(props: RM.DropdownMenuSeparatorProps) {
  return <RM.Separator {...props} className={`my-1 h-px bg-black/10 ${props.className || ''}`} />;
}

export function DropdownLabel(props: RM.DropdownMenuLabelProps) {
  return (
    <RM.Label
      {...props}
      className={`px-3 py-2 text-xs uppercase opacity-60 ${props.className || ''}`}
    />
  );
}

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

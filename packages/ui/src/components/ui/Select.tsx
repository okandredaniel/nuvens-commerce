// packages/ui/src/components/ui/Select.tsx
import type {
  SelectContentProps as RSelectContentProps,
  SelectItemProps as RSelectItemProps,
  SelectLabelProps as RSelectLabelProps,
  SelectScrollDownButtonProps as RSelectScrollDownButtonProps,
  SelectScrollUpButtonProps as RSelectScrollUpButtonProps,
  SelectSeparatorProps as RSelectSeparatorProps,
  SelectTriggerProps as RSelectTriggerProps,
} from '@radix-ui/react-select';
import * as SelectPrimitive from '@radix-ui/react-select';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import type { Size } from '../../interfaces/ui.interface';
import { cn } from '../../utils/cn';

function sizeClasses(size: Size = 'md') {
  if (size === 'sm') return 'h-9 text-sm px-3';
  if (size === 'lg') return 'h-11 text-base px-4';
  return 'h-10 text-sm px-3';
}

const transition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

type TriggerProps = RSelectTriggerProps & {
  size?: Size;
  invalid?: boolean;
  placeholder?: string;
};

export const SelectTrigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, size = 'md', invalid, placeholder = 'Selecione…', ...props }, ref) => {
    const rm = useReducedMotion();
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        aria-invalid={invalid ? true : undefined}
        className={cn(
          'group flex min-w-48 items-center justify-between ui-radius border bg-neutral-0 py-2 outline-none transition',
          'border-neutral-200 hover:border-neutral-300',
          'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses(size),
          invalid && 'border-danger-600 focus-visible:ring-danger-600',
          className,
        )}
        {...props}
      >
        <span className="flex-1 min-w-0 truncate text-left">
          <SelectPrimitive.Value
            placeholder={placeholder}
            className="truncate data-[placeholder]:text-neutral-500 text-neutral-900"
          />
        </span>
        <motion.span
          aria-hidden
          className="ml-2 grid h-8 w-8 place-items-center text-neutral-900"
          whileHover={rm ? undefined : { scale: 1.03 }}
          whileTap={rm ? undefined : { scale: 0.97 }}
          transition={transition}
        >
          <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
        </motion.span>
      </SelectPrimitive.Trigger>
    );
  },
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

type ContentProps = RSelectContentProps & {
  scrollUpLabel?: string;
  scrollDownLabel?: string;
};

export const SelectContent = forwardRef<HTMLDivElement, ContentProps>(
  (
    {
      className,
      children,
      position = 'popper',
      sideOffset = 8,
      scrollUpLabel,
      scrollDownLabel,
      ...props
    },
    ref,
  ) => {
    const rm = useReducedMotion();
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          position={position}
          sideOffset={sideOffset}
          avoidCollisions
          collisionPadding={8}
          className={cn(
            'z-50 min-w-[12rem] overflow-hidden ui-radius-lg border bg-neutral-0 text-neutral-900 shadow-lg outline-none',
            'border-neutral-200',
            className,
          )}
          {...props}
        >
          <SelectScrollUpButton ariaLabel={scrollUpLabel} />
          <SelectPrimitive.Viewport asChild>
            <motion.div
              initial={rm ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
              animate={rm ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={transition}
              className="max-h-64 p-1"
            >
              {children}
            </motion.div>
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton ariaLabel={scrollDownLabel} />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  },
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectLabel = forwardRef<HTMLDivElement, RSelectLabelProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Label
      ref={ref}
      className={cn('px-3 py-2 text-xs font-medium text-neutral-600', className)}
      {...props}
    />
  ),
);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

type ItemProps = RSelectItemProps & { hint?: string };

export const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ className, children, hint, ...props }, ref) => {
    const rm = useReducedMotion();
    return (
      <SelectPrimitive.Item
        ref={ref}
        className={cn(
          'relative flex w-full cursor-default select-none items-center ui-radius px-3 py-2 text-sm outline-none',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          'data-[highlighted]:bg-neutral-100 data-[state=checked]:bg-neutral-50',
          'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
          className,
        )}
        {...props}
      >
        <div className="mr-6 min-w-0 flex-1">
          <div className="truncate">
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
          </div>
          {hint ? <div className="mt-0.5 truncate text-xs text-neutral-600">{hint}</div> : null}
        </div>
        <SelectPrimitive.ItemIndicator className="absolute right-2 inline-flex items-center">
          <motion.span
            initial={false}
            animate={{ scale: 1, opacity: 1 }}
            transition={rm ? { duration: 0 } : transition}
          >
            <Check className="h-4 w-4" />
          </motion.span>
        </SelectPrimitive.ItemIndicator>
      </SelectPrimitive.Item>
    );
  },
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

export const SelectSeparator = forwardRef<HTMLDivElement, RSelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={cn('my-1 h-px bg-neutral-200', className)}
      {...props}
    />
  ),
);
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

type ScrollBtnBase = { ariaLabel?: string };
type ScrollUpBtnProps = RSelectScrollUpButtonProps & ScrollBtnBase;
type ScrollDownBtnProps = RSelectScrollDownButtonProps & ScrollBtnBase;

export function SelectScrollUpButton({ ariaLabel, className, ...props }: ScrollUpBtnProps) {
  return (
    <SelectPrimitive.ScrollUpButton
      aria-label={ariaLabel}
      className={cn(
        'flex cursor-default items-center justify-center bg-neutral-0/90 py-1',
        className,
      )}
      {...props}
    >
      <ChevronUp className="h-4 w-4 opacity-70" />
    </SelectPrimitive.ScrollUpButton>
  );
}

export function SelectScrollDownButton({ ariaLabel, className, ...props }: ScrollDownBtnProps) {
  return (
    <SelectPrimitive.ScrollDownButton
      aria-label={ariaLabel}
      className={cn(
        'flex cursor-default items-center justify-center bg-neutral-0/90 py-1',
        className,
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4 opacity-70" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export function SelectContentItem({
  value,
  children,
  hint,
}: {
  value: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <SelectItem value={value} hint={hint}>
      {children}
    </SelectItem>
  );
}

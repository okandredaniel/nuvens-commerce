import type { CheckedState } from '@radix-ui/react-checkbox';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';
import { cn } from '../../utils/cn';

export type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
  'asChild'
> & {
  name?: string;
  value?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
};

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    className,
    name,
    value = 'on',
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    required,
    inputRef,
    ...props
  },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState<boolean>(Boolean(defaultChecked));

  const currentChecked = (isControlled ? checked : internal) === true;

  const handleChange = (state: CheckedState) => {
    if (!isControlled) setInternal(state === true);
    onCheckedChange?.(state);
  };

  return (
    <>
      <RadixCheckbox.Root
        ref={ref}
        checked={isControlled ? checked : internal}
        onCheckedChange={handleChange}
        disabled={disabled}
        required={required}
        className={cn(
          'inline-flex h-5 w-5 items-center justify-center rounded-md',
          'border border-[color:var(--color-border)]',
          'bg-[color:var(--color-surface)]',
          'data-[state=checked]:bg-[color:var(--color-primary)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        )}
        {...props}
      >
        <RadixCheckbox.Indicator className="text-[color:var(--color-on-primary)]">
          <Check className="h-4 w-4" aria-hidden />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      {name ? (
        <input
          ref={inputRef as React.Ref<HTMLInputElement>}
          type="checkbox"
          name={name}
          value={value}
          checked={currentChecked}
          readOnly
          hidden
        />
      ) : null}
    </>
  );
});

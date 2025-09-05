import { forwardRef } from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...p },
  r,
) {
  return (
    <input
      ref={r}
      className={`h-10 w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 text-sm text-[color:var(--color-text)] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-border)] ${className || ''}`}
      {...p}
    />
  );
});

import { forwardRef } from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...p },
  r,
) {
  return (
    <textarea
      ref={r}
      className={`w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-border)] resize-y ${className || ''}`}
      {...p}
    />
  );
});

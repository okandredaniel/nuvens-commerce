import { forwardRef } from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...p },
  r,
) {
  return (
    <textarea
      ref={r}
      className={`w-full rounded-lg border border-neutral-200 bg-neutral-0 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-neutral-0 resize-y ${className || ''}`}
      {...p}
    />
  );
});

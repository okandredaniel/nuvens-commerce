import { cn } from '@nuvens/ui-core';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn('p-5 md:p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: DivProps) {
  return (
    <h3
      className={cn(
        'text-base md:text-lg font-semibold text-[color:var(--color-on-surface)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: DivProps) {
  return <p className={cn('text-sm text-[color:var(--color-muted)]', className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn('p-5 md:p-6', className)} {...props} />;
}

import { cn, Heading } from '@nuvens/ui';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn('rounded-xl border border-neutral-100 bg-neutral-0', className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn('p-5 md:p-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: DivProps) {
  return (
    <Heading
      as="h3"
      className={cn('text-base md:text-lg font-semibold text-neutral-900', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: DivProps) {
  return <p className={cn('text-sm text-neutral-600', className)} {...props} />;
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn('p-5 md:p-6', className)} {...props} />;
}

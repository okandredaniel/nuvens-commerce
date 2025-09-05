import { cn } from '../../utils/cn';

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'min-w-5 h-5 px-1 rounded-full grid place-items-center text-[10px] font-semibold',
        'bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)]',
        'border border-[color:var(--color-border)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

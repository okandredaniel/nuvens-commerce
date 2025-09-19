import * as RD from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export function DialogRoot(props: RD.DialogProps) {
  return <RD.Root {...props} />;
}

export function DialogTrigger(props: RD.DialogTriggerProps) {
  return <RD.Trigger {...props} />;
}

export function DialogPortal(props: RD.DialogPortalProps) {
  return <RD.Portal {...props} />;
}

export const DialogOverlay = forwardRef<HTMLDivElement, RD.DialogOverlayProps>(
  function DialogOverlay({ className, ...props }, ref) {
    return (
      <RD.Overlay
        ref={ref}
        {...props}
        className={cn(
          'fixed inset-0 bg-neutral-900/40 backdrop-blur-sm',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          className,
        )}
      />
    );
  },
);

type DialogContentProps = RD.DialogContentProps & { closeLabel: string };

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { children, className, closeLabel, ...rest },
  ref,
) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <RD.Content
        ref={ref}
        {...rest}
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 ui-radius-lg border border-neutral-200 bg-neutral-0 p-6 shadow-xl focus:outline-none',
          className,
        )}
      >
        {children}
        <RD.Close
          aria-label={closeLabel}
          className={cn(
            'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-neutral-0/70 text-neutral-700 outline-none transition hover:bg-neutral-0',
            'focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
          )}
        >
          <X className="h-4 w-4" />
        </RD.Close>
      </RD.Content>
    </DialogPortal>
  );
});

export const DialogHeader = function DialogHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('mb-3 space-y-1', className)}>{children}</div>;
};

export const DialogTitle = forwardRef<HTMLHeadingElement, RD.DialogTitleProps>(function DialogTitle(
  { className, ...props },
  ref,
) {
  return (
    <RD.Title
      ref={ref}
      {...props}
      className={cn('text-xl font-semibold text-neutral-900', className)}
    />
  );
});

export const DialogDescription = forwardRef<HTMLParagraphElement, RD.DialogDescriptionProps>(
  function DialogDescription({ className, ...props }, ref) {
    return (
      <RD.Description ref={ref} {...props} className={cn('text-sm text-neutral-600', className)} />
    );
  },
);

export const DialogFooter = function DialogFooter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mt-6 flex items-center justify-end gap-3', className)}>{children}</div>
  );
};

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: RD.Close,
};

import * as RD from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function DialogRoot(props: RD.DialogProps) {
  return <RD.Root {...props} />;
}

export function DialogTrigger(props: RD.DialogTriggerProps) {
  return <RD.Trigger {...props} />;
}

export function DialogPortal(props: RD.DialogPortalProps) {
  return <RD.Portal {...props} />;
}

export function DialogOverlay(props: RD.DialogOverlayProps) {
  return (
    <RD.Overlay
      {...props}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
    />
  );
}

export function DialogContent({ children, className, ...rest }: RD.DialogContentProps) {
  const { t } = useTranslation('common');
  return (
    <DialogPortal>
      <DialogOverlay />
      <RD.Content
        {...rest}
        className={`fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-[var(--color-surface)] p-6 shadow-xl focus:outline-none ${className || ''}`}
      >
        {children}
        <RD.Close
          aria-label={t('close')}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black/70 outline-none transition hover:bg-white"
        >
          <X className="h-4 w-4" />
        </RD.Close>
      </RD.Content>
    </DialogPortal>
  );
}

export function DialogHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <div className={`mb-3 space-y-1 ${className || ''}`}>{children}</div>;
}

export function DialogTitle(props: RD.DialogTitleProps) {
  return <RD.Title {...props} className={`text-xl font-semibold ${props.className || ''}`} />;
}

export function DialogDescription(props: RD.DialogDescriptionProps) {
  return <RD.Description {...props} className={`text-sm opacity-80 ${props.className || ''}`} />;
}

export function DialogFooter({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mt-6 flex items-center justify-end gap-3 ${className || ''}`}>{children}</div>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Footer: DialogFooter,
  Close: RD.Close,
};

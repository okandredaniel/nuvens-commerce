import * as Dialog from '@radix-ui/react-dialog';
import { forwardRef } from 'react';

type Side = 'right' | 'left';
type SheetProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  side?: Side;
  widthClass?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
};

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(function Sheet(
  { open, onOpenChange, side = 'right', widthClass = 'w-[92vw] sm:w-[420px]', title, children },
  ref,
) {
  const sideClass = side === 'left' ? 'left-0' : 'right-0';
  const inAnim =
    side === 'left'
      ? 'data-[state=open]:animate-[sheet-in-left_250ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[sheet-out-left_200ms_cubic-bezier(0.4,0,1,1)]'
      : 'data-[state=open]:animate-[sheet-in-right_250ms_cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:animate-[sheet-out-right_200ms_cubic-bezier(0.4,0,1,1)]';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-[overlay-in_200ms_ease-out] data-[state=closed]:animate-[overlay-out_150ms_ease-in]" />
        <Dialog.Content
          ref={ref}
          className={`fixed inset-y-0 ${sideClass} z-[60] ${widthClass} bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)] shadow-2xl outline-none flex flex-col will-change-transform ${inAnim}`}
        >
          {title ? (
            <div className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 border-b border-[color:var(--color-border)]">
              <Dialog.Title className="text-base font-semibold">{title}</Dialog.Title>
              <Dialog.Close className="h-8 w-8 grid place-items-center rounded-full border border-[color:var(--color-border)] hover:bg-black/5">
                ×
              </Dialog.Close>
            </div>
          ) : null}
          <div className="min-h-0 overflow-auto p-4 sm:p-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

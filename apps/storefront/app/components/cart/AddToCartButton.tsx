import { Button, cn } from '@nuvens/ui';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { Check, Loader2, ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FetcherWithComponents } from 'react-router';

type Props = {
  analytics: unknown;
  ariaLabel: string;
  children: React.ReactNode;
  disabled: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick: () => void;
};

export function AddToCartButton({
  analytics,
  ariaLabel,
  children,
  disabled,
  lines,
  onClick,
}: Props) {
  const [justAdded, setJustAdded] = useState(false);
  const prevState = useRef<'idle' | 'loading' | 'submitting'>('idle');
  const successTimer = useRef<number | null>(null);
  const openTimer = useRef<number | null>(null);

  return (
    <div className="w-full flex-1">
      <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
        {(fetcher: FetcherWithComponents<any>) => {
          const isBusy = fetcher.state !== 'idle';
          const showSuccess = justAdded && !isBusy;

          useEffect(() => {
            const was = prevState.current;
            const now = fetcher.state as 'idle' | 'loading' | 'submitting';
            if (now !== 'idle') {
              prevState.current = now;
              return;
            }
            if (was !== 'idle' && now === 'idle') {
              setJustAdded(true);
              if (successTimer.current) window.clearTimeout(successTimer.current);
              successTimer.current = window.setTimeout(() => setJustAdded(false), 2000);
            }
            prevState.current = now;
            return () => {
              if (successTimer.current) window.clearTimeout(successTimer.current);
            };
          }, [fetcher.state]);

          const handleOnClick = () => {
            if (openTimer.current) window.clearTimeout(openTimer.current);
            openTimer.current = window.setTimeout(() => onClick?.(), 500);
          };

          return (
            <>
              <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
              <Button
                type="submit"
                onClick={handleOnClick}
                disabled={disabled || isBusy}
                aria-busy={isBusy}
                data-state={isBusy ? 'submitting' : 'idle'}
                variant="primary"
                aria-label={ariaLabel}
                className={cn(
                  'relative w-full justify-center gap-2',
                  showSuccess ? 'bg-green-600 text-white' : '',
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none absolute inset-0 flex items-center justify-center',
                    isBusy ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    'pointer-events-none absolute inset-0 flex items-center justify-center',
                    showSuccess ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <Check className="h-6 w-6" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-2',
                    isBusy || showSuccess ? 'opacity-0' : 'opacity-100',
                  )}
                >
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  <span className="truncate">{children}</span>
                </span>
              </Button>
            </>
          );
        }}
      </CartForm>
    </div>
  );
}

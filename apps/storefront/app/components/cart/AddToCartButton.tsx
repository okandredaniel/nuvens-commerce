import { Button } from '@nuvens/ui';
import { CartForm, type OptimisticCartLineInput } from '@shopify/hydrogen';
import { Loader2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import type { FetcherWithComponents } from 'react-router';

type ButtonVariant = ComponentProps<typeof Button>['variant'];
type ButtonSize = ComponentProps<typeof Button>['size'];

type Props = {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  ariaLabel?: string;
};

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  variant,
  size,
  className,
  ariaLabel,
}: Props) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isBusy = fetcher.state !== 'idle';
        return (
          <>
            <input name="analytics" type="hidden" value={JSON.stringify(analytics)} />
            <Button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? isBusy}
              aria-busy={isBusy}
              data-state={isBusy ? 'submitting' : 'idle'}
              variant={variant}
              size={size}
              className={`inline-flex items-center gap-2 ${className || ''}`}
              aria-label={ariaLabel}
            >
              {isBusy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {children}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}

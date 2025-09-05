import { Button, Input } from '@nuvens/ui-core';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { FeedbackArea } from './FeedbackArea';
import { UpdateGiftCardForm } from './forms';

export function GiftCardBox({
  giftCards,
}: {
  giftCards: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const { t: tCart } = useTranslation('cart');
  const { t: tCommon } = useTranslation('common');
  const lastRef = useRef<string>('');

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 sm:p-5">
      <div className="text-sm font-medium">{tCart('giftcard.title')}</div>

      <UpdateGiftCardForm>
        {(state, fetcher) => {
          const incoming = (state.lastEntered || '').trim();
          if (incoming) lastRef.current = incoming;

          const phase = fetcher.state;
          const last = lastRef.current;
          const last4 = last ? last.slice(-4) : '';
          const effective =
            (fetcher.data?.cart?.appliedGiftCards as CartApiQueryFragment['appliedGiftCards']) ??
            giftCards ??
            [];
          const matched = last4
            ? effective?.some((g) => (g.lastCharacters || '') === last4)
            : false;

          const isLoading = phase !== 'idle';
          const attempted = Boolean(last || fetcher.data);
          const success = phase === 'idle' && attempted && matched;
          const error = phase === 'idle' && attempted && Boolean(last && !matched);

          return (
            <>
              <div className="mt-3 flex items-center gap-2">
                <Input
                  name="giftCardCode"
                  defaultValue={state.lastEntered || ''}
                  placeholder={tCart('giftcard.placeholder')}
                  aria-label={tCart('giftcard.placeholder')}
                />
                <Button type="submit" variant="outline" disabled={isLoading}>
                  {tCommon('actions.apply')}
                </Button>
              </div>

              <FeedbackArea
                fetcher={fetcher}
                loading={isLoading}
                success={success}
                error={error}
                successText={tCommon('status.applied')}
                errorText={tCommon('status.invalid')}
              />
            </>
          );
        }}
      </UpdateGiftCardForm>

      {giftCards?.length ? (
        <div className="mt-3 text-sm">
          <div className="flex items-center justify-between rounded-lg border border-[color:var(--color-border)] px-3 py-2">
            <code className="opacity-80">
              {giftCards.map((g) => `***${g.lastCharacters}`).join(', ')}
            </code>
            <UpdateGiftCardForm clear>
              {(_, fetcher) => (
                <Button type="submit" variant="ghost" size="sm" disabled={fetcher.state !== 'idle'}>
                  {tCommon('actions.remove')}
                </Button>
              )}
            </UpdateGiftCardForm>
          </div>
        </div>
      ) : null}
    </div>
  );
}

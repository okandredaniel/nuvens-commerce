import { Button, Card, CardContent, Input } from '@nuvens/ui';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { FetcherWithComponents } from 'react-router';
import { type CartApiQueryFragment } from '../../types/storefrontapi.generated';
import { FeedbackArea } from './FeedbackArea';
import { UpdateDiscountForm } from './forms';

export function DiscountBox({ codes }: { codes?: CartApiQueryFragment['discountCodes'] }) {
  const { t: tCart } = useTranslation('cart');
  const { t: tCommon } = useTranslation('common');
  const lastRef = useRef<string>('');

  const applied = codes?.filter((d) => d.applicable).map((d) => d.code) || [];

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="text-sm font-medium">{tCart('discount.title')}</div>

        {applied.length > 0 ? (
          <div className="mt-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2">
              <code className="opacity-80">{applied.join(', ')}</code>
              <UpdateDiscountForm>
                {(fetcher) => (
                  <Button
                    type="submit"
                    variant="ghost"
                    size="sm"
                    disabled={fetcher.state !== 'idle'}
                  >
                    {tCommon('actions.remove')}
                  </Button>
                )}
              </UpdateDiscountForm>
            </div>
          </div>
        ) : null}

        <UpdateDiscountForm discountCodes={applied}>
          {(fetcher: FetcherWithComponents<any>) => {
            const incoming = (fetcher.formData?.get('discountCode') as string | undefined)?.trim();
            if (incoming) lastRef.current = incoming;

            const phase = fetcher.state;
            const last = lastRef.current;
            const effectiveCodes =
              (fetcher.data?.cart?.discountCodes as CartApiQueryFragment['discountCodes']) ??
              codes ??
              [];
            const matched = last
              ? effectiveCodes?.find((c) => (c.code || '').toLowerCase() === last.toLowerCase())
              : undefined;

            const isLoading = phase !== 'idle';
            const attempted = Boolean(last || fetcher.data);
            const success = phase === 'idle' && attempted && Boolean(matched && matched.applicable);
            const error =
              phase === 'idle' &&
              attempted &&
              Boolean(last && (!matched || matched.applicable === false));

            return (
              <>
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    name="discountCode"
                    placeholder={tCart('discount.placeholder')}
                    aria-label={tCart('discount.placeholder')}
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
        </UpdateDiscountForm>
      </CardContent>
    </Card>
  );
}

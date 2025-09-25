import { CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { FetcherWithComponents } from 'react-router';

export function FeedbackArea({
  fetcher,
  loading,
  success,
  error,
  successText,
  errorText,
}: {
  fetcher: FetcherWithComponents<any>;
  loading: boolean;
  success: boolean;
  error: boolean;
  successText: string;
  errorText: string;
}) {
  const { t } = useTranslation('common');

  const raw = (fetcher as any)?.data?.errors;
  let serverErrors: string[] = [];
  if (Array.isArray(raw)) {
    serverErrors = raw
      .map((e: any) => (typeof e === 'string' ? e : e?.message))
      .filter((v: unknown): v is string => typeof v === 'string' && v.length > 0);
  } else if (typeof raw === 'string') {
    serverErrors = [raw];
  } else if (raw && typeof raw === 'object' && typeof (raw as any).message === 'string') {
    serverErrors = [(raw as any).message];
  }

  if (loading) {
    return (
      <div role="status" aria-live="polite" className="mt-2 text-xs opacity-70">
        {t('status.loading')}
      </div>
    );
  }

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-2 inline-flex items-center gap-1 text-xs text-[color:var(--color-accent)]"
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden />
        <span>{successText}</span>
      </div>
    );
  }

  if (error || serverErrors.length > 0) {
    return (
      <div role="alert" className="mt-2 text-xs text-[color:var(--color-danger)]">
        {serverErrors.length > 0 ? (
          <ul className="list-disc pl-5">
            {serverErrors.map((msg, i) => (
              <li key={i} className="flex items-start gap-1">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{msg}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="inline-flex items-center gap-1">
            <XCircle className="h-4 w-4" aria-hidden />
            <span>{errorText}</span>
          </div>
        )}
      </div>
    );
  }

  return null;
}

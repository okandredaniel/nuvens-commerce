import { Button, Checkbox, Input, Label } from '@nuvens/ui';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Tone = 'default' | 'onDark';

export function Newsletter({ tone = 'onDark' }: { tone?: Tone }) {
  const { t, i18n } = useTranslation('newsletter');

  const has = (k: string) => i18n.exists(`newsletter:${k}`);
  const action = has('action') ? t('action') : undefined;
  const privacyHref = has('privacy.href') ? t('privacy.href') : '#';
  const hasSubtitle = has('subtitle');

  const isDark = tone === 'onDark';
  const headingCls = isDark ? 'text-neutral-0' : 'text-neutral-900';
  const subtitleCls = isDark ? 'text-neutral-300' : 'text-neutral-600';
  const labelCls = isDark ? 'text-neutral-0' : 'text-neutral-900';
  const disclaimerCls = isDark ? 'text-neutral-400' : 'text-neutral-600';
  const linkCls = isDark ? 'text-neutral-0 underline' : 'underline';

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 text-center">
      <h2 className={`text-2xl font-semibold tracking-tight md:text-3xl ${headingCls}`}>
        {t('title')}
      </h2>

      <form
        method="post"
        action={action}
        className="grid gap-4 sm:grid-cols-[1fr_auto]"
        aria-describedby="newsletter-disclaimer"
      >
        <div className="relative">
          <Label htmlFor="newsletter-email" className="sr-only">
            {t('emailLabel')}
          </Label>

          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder={t('emailPlaceholder')}
            className="h-11 rounded-full pl-4 pr-12 text-neutral-900 placeholder:text-neutral-500 sm:pl-6 sm:pr-14"
          />

          <Button
            type="submit"
            size="sm"
            variant="primary"
            className="absolute right-1 top-1 hidden h-9 w-9 rounded-full p-0 sm:inline-flex md:h-9 md:w-9"
            aria-label={t('cta')}
            title={t('cta')}
          >
            <ChevronRight />
          </Button>
        </div>

        <div className="sm:hidden">
          <Button type="submit" size="md" variant="primary" className="w-full">
            {t('cta')}
          </Button>
        </div>
      </form>

      {hasSubtitle ? (
        <p className={`text-sm leading-relaxed ${subtitleCls}`}>{t('subtitle')}</p>
      ) : null}

      <div className="flex items-start justify-center gap-2">
        <Checkbox id="newsletter-consent" name="consent" required />
        <Label htmlFor="newsletter-consent" className={`text-sm ${labelCls}`}>
          {t('consent')}
        </Label>
      </div>

      <p id="newsletter-disclaimer" className={`text-xs ${disclaimerCls}`}>
        {t('disclaimer.part1')}{' '}
        <a href={privacyHref} className={linkCls}>
          {t('disclaimer.privacy')}
        </a>{' '}
        {t('disclaimer.part2')}
      </p>
    </div>
  );
}

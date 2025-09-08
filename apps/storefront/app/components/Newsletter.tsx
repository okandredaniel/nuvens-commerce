import { Button, Checkbox, Input, Label } from '@nuvens/ui-core';
import { useTranslation } from 'react-i18next';

export function Newsletter() {
  const { t, i18n } = useTranslation('newsletter');

  const has = (k: string) => i18n.exists(`newsletter:${k}`);
  const action = has('action') ? t('action') : undefined;
  const privacyHref = has('privacy.href') ? t('privacy.href') : '#';
  const hasSubtitle = has('subtitle');

  return (
    <section className="w-full">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{t('title')}</h2>

        <form method="post" action={action} className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Label htmlFor="newsletter-email" className="sr-only">
              {t('emailLabel')}
            </Label>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder={t('emailPlaceholder')}
              className="h-12 pl-6 pr-14 rounded-full"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              className="absolute right-1 top-1 h-10 w-10 rounded-full p-0"
              aria-label={t('cta')}
              title={t('cta')}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>

          <div className="sm:hidden">
            <Button type="submit" size="md" variant="primary" className="w-full">
              {t('cta')}
            </Button>
          </div>
        </form>

        {hasSubtitle ? <p className="text-sm leading-relaxed">{t('subtitle')}</p> : null}

        <div className="flex items-start justify-center gap-2">
          <Checkbox id="newsletter-consent" name="consent" required />
          <Label htmlFor="newsletter-consent" className="text-sm">
            {t('consent')}
          </Label>
        </div>

        <p className="text-xs opacity-70">
          {t('disclaimer.part1')}{' '}
          <a href={privacyHref} className="underline">
            {t('disclaimer.privacy')}
          </a>{' '}
          {t('disclaimer.part2')}
        </p>
      </div>
    </section>
  );
}

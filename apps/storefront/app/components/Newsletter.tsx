import { Button, Checkbox, Input, Label } from '@nuvens/ui-core';
import { useTranslation } from 'react-i18next';

export function Newsletter() {
  const { t } = useTranslation('newsletter');
  const action = t('action') || undefined;
  const privacy = t('privacy.href') || '#';

  return (
    <section className="border-t border-[color:var(--color-border)] bg-[color:var(--color-muted)]/10 py-16">
      <h3 className="text-lg font-semibold text-[color:var(--color-on-surface)] mb-2 max-w-4xl m-auto">
        {t('title')}
      </h3>
      <form
        method="post"
        action={action}
        className="grid gap-4 sm:grid-cols-[1fr_auto] max-w-4xl m-auto"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="newsletter-email">{t('emailLabel')}</Label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            required
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" size="md" variant="primary">
            {t('cta')}
          </Button>
        </div>
        <div className="sm:col-span-2 flex items-start gap-2">
          <Checkbox id="newsletter-consent" name="consent" required />
          <Label
            htmlFor="newsletter-consent"
            className="text-sm text-[color:var(--color-on-surface)]"
          >
            {t('consent')}
          </Label>
        </div>
        <p className="sm:col-span-2 text-xs text-[color:var(--color-muted)]">
          {t('disclaimer.part1')}{' '}
          <a href={privacy} className="underline text-[color:var(--color-accent)]">
            {t('disclaimer.privacy')}
          </a>{' '}
          {t('disclaimer.part2')}
        </p>
      </form>
    </section>
  );
}

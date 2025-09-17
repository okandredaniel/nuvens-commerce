import { LocalizedLink } from '@/components/LocalizedLink';
import { Button, Container } from '@nuvens/ui';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ErrorView({ status = 500, message = '' }: { status?: number; message?: string }) {
  const { t } = useTranslation('common');

  return (
    <main id="content" role="main" className="bg-[color:var(--color-surface)]">
      <Container className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-7xl md:text-9xl font-bold text-[color:var(--color-muted)]/20 mb-4">
              {status}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--color-on-surface)] mb-4">
            {t('errors.title')}
          </h1>
          {message ? (
            <p className="text-base md:text-lg text-[color:var(--color-muted)] mb-8 max-w-lg mx-auto">
              {message}
            </p>
          ) : null}
          <Button asChild size="md" variant="primary">
            <LocalizedLink to="/">
              <Home className="w-5 h-5 mr-2" />
              {t('actions.home')}
            </LocalizedLink>
          </Button>
        </div>
      </Container>
    </main>
  );
}

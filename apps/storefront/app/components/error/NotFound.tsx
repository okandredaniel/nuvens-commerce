import { Button, Container } from '@nuvens/ui';
import { ArrowLeft, Home, MessageCircle, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { LocalizedLink } from '~/components/LocalizedLink';

export function NotFoundView() {
  const { t } = useTranslation('notFound');
  const navigate = useNavigate();

  return (
    <main id="content" role="main" className="bg-[color:var(--color-surface)]">
      <Container className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-7xl md:text-9xl font-bold text-[color:var(--color-muted)]/20 mb-4">
              404
            </div>
            <div className="w-28 h-28 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-[color:var(--color-accent)]/10 flex items-center justify-center">
              <Search className="w-14 h-14 md:w-16 md:h-16 text-[color:var(--color-accent)]" />
            </div>
          </div>

          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[color:var(--color-on-surface)] mb-4 text-balance">
              {t('title')}
            </h1>
            <p className="text-base md:text-lg text-[color:var(--color-muted)] mb-8 text-pretty max-w-lg mx-auto">
              {t('subtitle')}
            </p>

            <Button asChild size="md" variant="primary" className="mb-8">
              <LocalizedLink to="/">
                <Home className="w-5 h-5 mr-2" />
                {t('actions.home')}
              </LocalizedLink>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <LocalizedLink
              to="/pages/contact"
              className="group p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-accent)]/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
            >
              <MessageCircle className="w-8 h-8 text-[color:var(--color-accent)] mb-3 mx-auto" />
              <h3 className="font-semibold text-[color:var(--color-on-surface)] mb-2">
                {t('cards.contact.title')}
              </h3>
              <p className="text-sm text-[color:var(--color-muted)]">{t('cards.contact.desc')}</p>
            </LocalizedLink>

            <LocalizedLink
              to="/search"
              className="group p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-accent)]/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
            >
              <Search className="w-8 h-8 text-[color:var(--color-accent)] mb-3 mx-auto" />
              <h3 className="font-semibold text-[color:var(--color-on-surface)] mb-2">
                {t('cards.search.title')}
              </h3>
              <p className="text-sm text-[color:var(--color-muted)]">{t('cards.search.desc')}</p>
            </LocalizedLink>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="group p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-accent)]/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
            >
              <ArrowLeft className="w-8 h-8 text-[color:var(--color-accent)] mb-3 mx-auto" />
              <h3 className="font-semibold text-[color:var(--color-on-surface)] mb-2">
                {t('cards.back.title')}
              </h3>
              <p className="text-sm text-[color:var(--color-muted)]">{t('cards.back.desc')}</p>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-[color:var(--color-muted)]">
            <LocalizedLink
              to="/policies/privacy-policy"
              className="hover:text-[color:var(--color-on-surface)] transition-colors"
            >
              {t('links.privacy')}
            </LocalizedLink>
            {'•'}
            <LocalizedLink
              to="/policies/terms-of-service"
              className="hover:text-[color:var(--color-on-surface)] transition-colors"
            >
              {t('links.terms')}
            </LocalizedLink>
            {'•'}
            <LocalizedLink
              to="/pages/help"
              className="hover:text-[color:var(--color-on-surface)] transition-colors"
            >
              {t('links.help')}
            </LocalizedLink>
          </div>
        </div>
      </Container>
    </main>
  );
}

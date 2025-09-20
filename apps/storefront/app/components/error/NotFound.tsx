import { LocalizedLink } from '@/components/LocalizedLink';
import { Button, Card, CardContent, Container, Heading } from '@nuvens/ui';
import { ArrowLeft, Home, MessageCircle, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export function NotFoundView() {
  const { t } = useTranslation('notFound');
  const navigate = useNavigate();

  return (
    <main id="content" role="main" className="bg-neutral-0">
      <div className="bg-primary-600 text-center">
        <Container className="flex flex-col items-center gap-6 pt-24 pb-10 md:flex-row md:justify-center md:gap-12 md:pt-28 md:pb-12">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-100/20 md:h-32 md:w-32"
            aria-hidden
          >
            <Search className="h-12 w-12 text-white md:h-16 md:w-16" />
          </div>
          <div
            className="font-bold text-[64px] leading-none text-white/30 md:text-[120px]"
            aria-hidden
          >
            404
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-12">
            <Heading as="h1" align="center" className="mb-4 text-balance">
              {t('title')}
            </Heading>
            <p className="mx-auto mb-8 max-w-lg text-pretty text-neutral-600">{t('subtitle')}</p>

            <Button asChild size="md" variant="primary" className="mb-8">
              <LocalizedLink to="/" prefetch="intent" aria-label={t('actions.home')}>
                <Home className="mr-2 h-5 w-5" />
                {t('actions.home')}
              </LocalizedLink>
            </Button>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            <LocalizedLink
              to="/pages/contact"
              prefetch="intent"
              aria-label={t('cards.contact.title')}
            >
              <Card className="ui-radius transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 focus-within:ring-offset-neutral-0">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <MessageCircle className="mb-3 h-8 w-8 text-accent-600" aria-hidden />
                    <Heading as="h3" className="mb-2 text-base font-semibold">
                      {t('cards.contact.title')}
                    </Heading>
                    <p className="text-sm text-neutral-600">{t('cards.contact.desc')}</p>
                  </div>
                </CardContent>
              </Card>
            </LocalizedLink>

            <LocalizedLink to="/search" prefetch="intent" aria-label={t('cards.search.title')}>
              <Card className="ui-radius transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 focus-within:ring-offset-neutral-0">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Search className="mb-3 h-8 w-8 text-accent-600" aria-hidden />
                    <Heading as="h3" className="mb-2 text-base font-semibold">
                      {t('cards.search.title')}
                    </Heading>
                    <p className="text-sm text-neutral-600">{t('cards.search.desc')}</p>
                  </div>
                </CardContent>
              </Card>
            </LocalizedLink>

            <Card className="ui-radius transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 focus-within:ring-offset-neutral-0">
              <CardContent className="p-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  aria-label={t('cards.back.title')}
                  className="block w-full"
                >
                  <div className="flex flex-col items-center text-center">
                    <ArrowLeft className="mb-3 h-8 w-8 text-accent-600" aria-hidden />
                    <Heading as="h3" className="mb-2 text-base font-semibold">
                      {t('cards.back.title')}
                    </Heading>
                    <p className="text-sm text-neutral-600">{t('cards.back.desc')}</p>
                  </div>
                </button>
              </CardContent>
            </Card>
          </div>

          <nav aria-label={t('links.aria')} className="flex justify-center">
            <ul className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
              <li>
                <LocalizedLink to="/policies/privacy-policy">{t('links.privacy')}</LocalizedLink>
              </li>
              <li aria-hidden>•</li>
              <li>
                <LocalizedLink to="/policies/terms-of-service">{t('links.terms')}</LocalizedLink>
              </li>
              <li aria-hidden>•</li>
              <li>
                <LocalizedLink to="/pages/help">{t('links.help')}</LocalizedLink>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </main>
  );
}

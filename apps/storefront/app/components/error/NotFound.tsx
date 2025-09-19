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
        <Container className="flex justify-center gap-12 pt-28 pb-12">
          <div
            className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-accent-100/20 md:h-32 md:w-32"
            aria-hidden
          >
            <Search className="h-14 w-14 text-white md:h-16 md:w-16" />
          </div>
          <div
            className="font-bold text-[72px] leading-none text-white/30 md:text-[120px]"
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
            <Card className="ui-radius transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <LocalizedLink
                  to="/pages/contact"
                  prefetch="intent"
                  aria-label={t('cards.contact.title')}
                >
                  <div className="flex flex-col items-center text-center">
                    <MessageCircle className="mb-3 h-8 w-8 text-accent-600" aria-hidden />
                    <Heading as="h3" className="mb-2 text-base font-semibold">
                      {t('cards.contact.title')}
                    </Heading>
                    <p className="text-sm text-neutral-600">{t('cards.contact.desc')}</p>
                  </div>
                </LocalizedLink>
              </CardContent>
            </Card>

            <Card className="ui-radius transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <LocalizedLink to="/search" prefetch="intent" aria-label={t('cards.search.title')}>
                  <div className="flex flex-col items-center text-center">
                    <Search className="mb-3 h-8 w-8 text-accent-600" aria-hidden />
                    <Heading as="h3" className="mb-2 text-base font-semibold">
                      {t('cards.search.title')}
                    </Heading>
                    <p className="text-sm text-neutral-600">{t('cards.search.desc')}</p>
                  </div>
                </LocalizedLink>
              </CardContent>
            </Card>

            <Card className="ui-radius transition-shadow hover:shadow-md">
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

          <nav
            aria-label={t('links.aria')}
            className="flex flex-wrap justify-center gap-6 text-sm text-neutral-600"
          >
            <LocalizedLink to="/policies/privacy-policy">{t('links.privacy')}</LocalizedLink>
            {'•'}
            <LocalizedLink to="/policies/terms-of-service">{t('links.terms')}</LocalizedLink>
            {'•'}
            <LocalizedLink to="/pages/help">{t('links.help')}</LocalizedLink>
          </nav>
        </div>
      </Container>
    </main>
  );
}

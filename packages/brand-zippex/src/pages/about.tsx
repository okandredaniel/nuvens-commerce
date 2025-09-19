import { Badge, Button, Card, CardContent, Container, Heading, Link } from '@nuvens/ui';
import { Award, Globe, Heart, Lightbulb, Shield, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AboutPage() {
  const { t } = useTranslation('about');

  const timeline = [
    {
      year: '2020',
      title: t('timeline.2020.title'),
      text: t('timeline.2020.text'),
    },
    {
      year: '2022',
      title: t('timeline.2022.title'),
      text: t('timeline.2022.text'),
    },
    {
      year: '2024',
      title: t('timeline.2024.title'),
      text: t('timeline.2024.text'),
    },
  ];

  const values = [
    {
      icon: Heart,
      title: t('values.passion.title'),
      text: t('values.passion.text'),
    },
    {
      icon: Shield,
      title: t('values.quality.title'),
      text: t('values.quality.text'),
    },
    {
      icon: Users,
      title: t('values.proximity.title'),
      text: t('values.proximity.text'),
    },
  ];

  const commitments = [
    {
      icon: Globe,
      title: t('commitments.european.title'),
      text: t('commitments.european.text'),
    },
    {
      icon: Award,
      title: t('commitments.fairPrices.title'),
      text: t('commitments.fairPrices.text'),
    },
    {
      icon: Shield,
      title: t('commitments.satisfaction.title'),
      text: t('commitments.satisfaction.text'),
    },
    {
      icon: Heart,
      title: t('commitments.environment.title'),
      text: t('commitments.environment.text'),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <section aria-labelledby="about-hero" className="relative bg-zinc-50 py-24 px-4">
        <Container className="flex flex-col text-center">
          <Badge className="m-auto">{t('hero.badge')}</Badge>
          <Heading id="about-hero" as="h1" align="center">
            {t('hero.title.prefix')} <span className="text-sky-600">{t('hero.title.brand')}</span> !
          </Heading>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-zinc-600">
            {t('hero.subtitle')}
          </p>
        </Container>
      </section>

      <section aria-labelledby="about-start" className="py-20 px-4">
        <Container className="max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Heading id="about-start" as="h2" className="mb-6">
                {t('start.heading')}
              </Heading>
              <div className="space-y-6 leading-relaxed text-zinc-600">
                <p>{t('start.p1')}</p>
                <p>{t('start.p2')}</p>
                <p>{t('start.p3')}</p>
              </div>
            </div>
            <div className="relative">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-sky-600/10">
                <Lightbulb className="h-24 w-24 text-sky-600" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-journey" className="bg-zinc-100/40 py-20 px-4">
        <Container className="max-w-4xl">
          <Heading id="about-journey" as="h2" align="center" className="mb-16">
            {t('journey.heading')}
          </Heading>
          <ol className="space-y-12">
            {timeline.map((item) => (
              <li key={item.year} className="flex items-start gap-8">
                <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-full bg-sky-600 font-bold text-white">
                  {item.year}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-zinc-600">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="about-values" className="py-20 px-4">
        <Container className="max-w-6xl">
          <div className="mb-16 text-center">
            <Heading id="about-values" as="h2" className="mb-4" align="center">
              {t('values.heading')}
            </Heading>
            <p className="mx-auto max-w-2xl text-zinc-600">{t('values.subtitle')}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <Card
                key={title}
                className="group border-zinc-200/80 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-sky-600/10 transition-colors group-hover:bg-sky-600/20">
                    <Icon className="h-8 w-8 text-sky-600" aria-hidden="true" />
                  </div>
                  <h3 className="mb-4 text-xl font-semibold">{title}</h3>
                  <p className="text-zinc-600">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-commitments" className="py-20 px-4">
        <Container className="max-w-4xl">
          <div className="mb-16 text-center">
            <Heading id="about-commitments" as="h2" className="mb-4" align="center">
              {t('commitments.heading')}
            </Heading>
            <p className="text-zinc-600">{t('commitments.subtitle')}</p>
          </div>
          <div className="grid gap-12 md:grid-cols-2">
            {commitments.map(({ icon: Icon, title, text }) => (
              <div key={title} className="space-y-2">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-full bg-sky-600/10">
                    <Icon className="h-6 w-6 text-sky-600" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                    <p className="text-zinc-600">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-cta" className="bg-sky-600 py-20 px-4 text-white">
        <Container className="max-w-4xl text-center">
          <Heading id="about-cta" as="h2" className="mb-6 text-inherit" align="center">
            {t('cta.heading')}
          </Heading>
          <p className="mb-8 text-xl opacity-90">{t('cta.subtitle')}</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="white">
              <Link to="/">{t('cta.primary')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pages/contact">{t('cta.secondary')}</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

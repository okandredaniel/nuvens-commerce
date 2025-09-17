import { Badge, Button, Card, CardContent, Container, Heading, Link } from '@nuvens/ui';
import { Award, Globe, Heart, Lightbulb, Shield, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AboutPage() {
  const { t } = useTranslation('about');

  const timeline = [
    { year: '2020', title: t('timeline.2020.title'), text: t('timeline.2020.text') },
    { year: '2022', title: t('timeline.2022.title'), text: t('timeline.2022.text') },
    { year: '2024', title: t('timeline.2024.title'), text: t('timeline.2024.text') },
  ];

  const values = [
    { icon: Heart, title: t('values.passion.title'), text: t('values.passion.text') },
    { icon: Shield, title: t('values.quality.title'), text: t('values.quality.text') },
    { icon: Users, title: t('values.proximity.title'), text: t('values.proximity.text') },
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
    <div className="min-h-screen bg-background">
      <section aria-labelledby="about-hero" className="relative bg-muted py-24 px-4">
        <Container className="flex flex-col text-center">
          <Badge className="m-auto">{t('hero.badge')}</Badge>
          <Heading id="about-hero" as="h1" align="center">
            {t('hero.title.prefix')} <span className="text-primary">{t('hero.title.brand')}</span> !
          </Heading>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </Container>
      </section>

      <section aria-labelledby="about-start" className="py-20 px-4">
        <Container className="max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Heading id="about-start" as="h2" className="mb-6">
                {t('start.heading')}
              </Heading>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>{t('start.p1')}</p>
                <p>{t('start.p2')}</p>
                <p>{t('start.p3')}</p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-primary/10 rounded-2xl flex items-center justify-center">
                <Lightbulb className="w-24 h-24 text-primary" aria-hidden="true" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-journey" className="py-20 px-4 bg-muted/30">
        <Container className="max-w-4xl">
          <Heading id="about-journey" as="h2" align="center" className="mb-16">
            {t('journey.heading')}
          </Heading>
          <ol className="space-y-12">
            {timeline.map((item) => (
              <li key={item.year} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full grid place-items-center text-primary-foreground font-bold">
                  {item.year}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="about-values" className="py-20 px-4">
        <Container className="max-w-6xl">
          <div className="text-center mb-16">
            <Heading id="about-values" as="h2" className="mb-4">
              {t('values.heading')}
            </Heading>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t('values.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, text }) => (
              <Card
                key={title}
                className="group transition-all duration-300 border-border/50 hover:shadow-lg"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full grid place-items-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">{title}</h3>
                  <p className="text-muted-foreground">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="about-commitments" className="py-20 px-4">
        <Container className="max-w-4xl">
          <div className="text-center mb-16">
            <Heading id="about-commitments" as="h2" className="mb-4">
              {t('commitments.heading')}
            </Heading>
            <p className="text-muted-foreground">{t('commitments.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {commitments.map(({ icon: Icon, title, text }) => (
              <div key={title} className="space-y-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full grid place-items-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                    <p className="text-muted-foreground">{text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="about-cta"
        className="py-20 px-4 bg-primary text-primary-foreground"
      >
        <Container className="max-w-4xl text-center">
          <Heading id="about-cta" as="h2" className="mb-6">
            {t('cta.heading')}
          </Heading>
          <p className="text-xl mb-8 opacity-90">{t('cta.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="outline" className="text-primary">
              <Link to="/">{t('cta.primary')}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link to="/pages/contact">{t('cta.secondary')}</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

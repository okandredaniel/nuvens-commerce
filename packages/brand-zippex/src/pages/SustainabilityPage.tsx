import { type PageTemplateProps } from '@nuvens/core';
import { LocalizedNavLink } from '@nuvens/shopify';
import {
  Accordion,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  placeholderImage,
} from '@nuvens/ui';

export function SustainabilityPage(page: PageTemplateProps) {
  return (
    <div className="min-h-screen">
      <section
        className="relative border-b border-neutral-50 bg-neutral-50 py-16"
        aria-labelledby="sust-hero"
      >
        <Container className="max-w-6xl text-center">
          <Badge className="mx-auto mb-6 border border-accent-200 bg-accent-50 text-accent-700">
            Sustainability
          </Badge>
          <Heading id="sust-hero" as="h1" align="center">
            Better sleep, lower footprint
          </Heading>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-neutral-700">
            Safer materials, smarter packaging, and a clear end-of-life path in France.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products">Shop Now</LocalizedNavLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedNavLink to="/pages/warranty">Warranty</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="sust-kpis">
        <Container className="max-w-6xl">
          <Heading id="sust-kpis" as="h2" align="center" className="mb-10">
            Our approach at a glance
          </Heading>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Certified textiles</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-800">
                OEKO-TEX® STANDARD 100 where applicable, for components tested against harmful
                substances.
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle>Safer foams</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-800">
                CertiPUR-EU where applicable, covering substances and emissions in PU foams.
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle>End-of-life in France</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-800">
                Take-back via accredited schemes (e.g., Ecomaison) for collection and recycling.
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-primary-600/10 py-16" aria-labelledby="sust-materials">
        <Container className="max-w-6xl">
          <Heading id="sust-materials" as="h2" align="center" className="mb-10 text-primary-800">
            Materials &amp; certifications
          </Heading>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={placeholderImage}
                  alt="OEKO-TEX STANDARD 100 badge"
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-sm text-neutral-700">Textile safety label</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={placeholderImage}
                  alt="CertiPUR-EU badge"
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-sm text-neutral-700">Foam certification</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={placeholderImage}
                  alt="EU Ecolabel badge"
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-sm text-neutral-700">EU environmental criteria</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={placeholderImage}
                  alt="Info-tri / Triman for FR packaging (illustrative)"
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-sm text-neutral-700">Sorting info on packaging (FR)</p>
              </CardContent>
            </Card>
          </div>

          <p className="mx-auto mt-8 max-w-4xl text-center text-neutral-700">
            Badges are shown where certification applies to the specific product. Always check the
            product page for details.
          </p>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="sust-endoflife">
        <Container className="max-w-6xl">
          <Heading id="sust-endoflife" as="h2" align="center" className="mb-10">
            End-of-life, made easy (France)
          </Heading>

          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-4 text-neutral-800">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                <p>
                  Take-back and recycling through accredited eco-organisations (e.g., Ecomaison).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                <p>Keep items dry and properly packaged for transport when required.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                <p>Donation and reuse options may be available if the condition allows.</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <LocalizedNavLink to="/pages/100-nights">100-Night Trial</LocalizedNavLink>
                </Button>
                <Button asChild variant="outline">
                  <LocalizedNavLink to="/pages/warranty">Warranty</LocalizedNavLink>
                </Button>
              </div>
            </div>

            <figure className="overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={placeholderImage}
                alt="Recycling facility handling end-of-life mattresses"
                className="h-full w-full object-cover"
              />
            </figure>
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50 py-16" aria-labelledby="sust-faq">
        <Container className="max-w-6xl">
          <Heading id="sust-faq" as="h2" align="center" className="mb-8 text-primary-900">
            Common questions
          </Heading>
          <div className="mx-auto max-w-3xl">
            <Accordion
              type="single"
              items={[
                {
                  title: 'Are all products certified?',
                  content:
                    'Certification applies per product or component. Check each product page for exact labels.',
                },
                {
                  title: 'Do badges guarantee recyclability?',
                  content:
                    'Badges cover safety or eco criteria; recycling depends on local facilities and programs.',
                },
                {
                  title: 'How do I dispose of my old mattress in France?',
                  content:
                    'Use accredited schemes such as Ecomaison take-back or approved collection points.',
                },
                {
                  title: 'Is packaging sorting info shown in France?',
                  content:
                    'Yes, products sold in France include sorting information (Info-tri) on packaging where required.',
                },
              ]}
              defaultValue="0"
              ariaToggleLabel="Toggle"
            />
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products">Shop Now</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

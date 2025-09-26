import { type PageTemplateProps } from '@nuvens/core';
import { LocalizedNavLink } from '@nuvens/shopify';
import { Badge, Button, Card, CardContent, Container, Heading, placeholderImage } from '@nuvens/ui';

export default function TechnologyPage(page: PageTemplateProps) {
  return (
    <div className="min-h-screen">
      <section
        className="relative border-b border-neutral-50 bg-neutral-50 py-16"
        aria-labelledby="tech-hero"
      >
        <Container className="max-w-6xl text-center">
          <Badge className="mx-auto mb-6 border border-accent-200 bg-accent-50 text-accent-700">
            Technology
          </Badge>
          <Heading id="tech-hero" as="h1" align="center">
            Engineered comfort, proven by tests
          </Heading>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-neutral-700">
            Pressure relief, stable support, breathable layers. See how our build translates into
            better nights.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products">Shop Mattresses</LocalizedNavLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedNavLink to="/pages/100-nights">100-Night Trial</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="tech-proof">
        <Container className="max-w-6xl">
          <Heading id="tech-proof" as="h2" align="center" className="mb-10">
            Materials &amp; safety you can trust
          </Heading>

          {/* Proof bar with certification badges (swap assets if you are certified) */}
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={placeholderImage}
                  alt="OEKO-TEX STANDARD 100"
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-sm text-neutral-700">
                  Textiles tested for harmful substances
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={placeholderImage}
                  alt="CertiPUR-EU foam"
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-sm text-neutral-700">Certified polyurethane foam</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={placeholderImage}
                  alt="EU Ecolabel (where applicable)"
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-sm text-neutral-700">EU environmental criteria</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <img
                  src={placeholderImage}
                  alt="Lab-tested performance"
                  className="mx-auto h-10 w-auto"
                />
                <p className="mt-2 text-sm text-neutral-700">Independent lab methods</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-primary-600/10 py-16" aria-labelledby="tech-inside">
        <Container className="max-w-6xl">
          <Heading id="tech-inside" as="h2" align="center" className="mb-10 text-primary-800">
            Inside the mattress
          </Heading>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-xl bg-neutral-100">
              <img
                src={placeholderImage}
                alt="Layered cutaway highlighting comfort foam, support foam, and cover"
                className="h-full w-full object-cover"
              />
            </figure>

            <div className="space-y-4 text-neutral-800">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                <p>
                  Pressure relief foams contour gently to reduce hotspots around shoulders and hips.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                <p>Stabilizing core increases spinal alignment and minimizes motion transfer.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                <p>
                  Breathable cover and channels support airflow for a fresh feel through the night.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <LocalizedNavLink to="/pages/warranty">Warranty</LocalizedNavLink>
                </Button>
                <Button asChild variant="outline">
                  <LocalizedNavLink to="/pages/care-guide">Care Guide</LocalizedNavLink>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="tech-demos">
        <Container className="max-w-6xl">
          <Heading id="tech-demos" as="h2" align="center" className="mb-10">
            Real-world demos
          </Heading>

          <div className="grid gap-10 lg:grid-cols-2">
            <figure className="overflow-hidden rounded-xl bg-neutral-100">
              <video className="h-full w-full" controls playsInline>
                <source src="/zippex-cambio-de-nucleos.mov" type="video/mp4" />
              </video>
              <figcaption className="p-3 text-sm text-neutral-700">
                Motion isolation demo with a glass placed over the surface.
              </figcaption>
            </figure>

            <figure className="overflow-hidden rounded-xl bg-neutral-100">
              <video className="h-full w-full" controls playsInline>
                <source src="/zippex-cambio-de-nucleos.mov" type="video/mp4" />
              </video>
              <figcaption className="p-3 text-sm text-neutral-700">
                Airflow test showing heat dissipation under load.
              </figcaption>
            </figure>
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products">Find Your Mattress</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

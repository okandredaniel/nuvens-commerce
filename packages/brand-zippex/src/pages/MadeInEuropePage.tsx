import { type PageTemplateProps } from '@nuvens/core';
import { LocalizedNavLink } from '@nuvens/shopify';
import {
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

export function MadeInEuropePage(page: PageTemplateProps) {
  return (
    <div className="min-h-screen">
      <section
        className="relative border-b border-neutral-50 bg-neutral-50 py-16"
        aria-labelledby="mie-hero"
      >
        <Container className="max-w-6xl text-center">
          <Badge className="mx-auto mb-6 border border-accent-200 bg-accent-50 text-accent-700">
            Made in Europe
          </Badge>
          <Heading id="mie-hero" as="h1" align="center">
            European craft, consistent quality
          </Heading>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-neutral-700">
            Shorter supply chains, strict standards, and partners we know by name.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products">Shop Mattresses</LocalizedNavLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedNavLink to="/pages/sustainability">Our Sustainability</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="mie-why">
        <Container className="max-w-6xl">
          <Heading id="mie-why" as="h2" align="center" className="mb-10">
            Why European manufacturing matters
          </Heading>

          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Quality control</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-800">
                Tighter process oversight and consistent materials from audited suppliers.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Responsible standards</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-800">
                Strong labor and environmental protections across the EU.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Faster delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-800">
                Shorter transport routes mean fresher stock and reliable ETAs.
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-primary-600/10 py-16" aria-labelledby="mie-journey">
        <Container className="max-w-6xl">
          <Heading id="mie-journey" as="h2" align="center" className="mb-10 text-primary-800">
            From factory to your bedroom
          </Heading>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              'Foams & fabrics',
              'Assembly & checks',
              'Compression & packing',
              'Local delivery',
            ].map((step, idx) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                  {idx + 1}
                </div>
                <p className="text-neutral-800">{step}</p>
              </div>
            ))}
          </div>

          <figure className="mx-auto mt-10 w-full max-w-5xl overflow-hidden rounded-xl bg-neutral-100">
            <video className="h-full w-full" controls playsInline>
              <source src="/zippex-cambio-de-nucleos.mov" type="video/mp4" />
            </video>
          </figure>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="mie-proof">
        <Container className="max-w-6xl">
          <Heading id="mie-proof" as="h2" align="center" className="mb-10">
            Our European partners
          </Heading>

          {/* Replace with supplier/factory brand marks you are allowed to show */}
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
            {['partner-1.png', 'partner-2.png', 'partner-3.png', 'partner-4.png'].map((logo) => (
              <Card key={logo}>
                <CardContent className="grid place-items-center p-6">
                  <img
                    src={placeholderImage}
                    alt="Manufacturing partner logo"
                    className="h-8 w-auto"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products">Shop European-Made</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

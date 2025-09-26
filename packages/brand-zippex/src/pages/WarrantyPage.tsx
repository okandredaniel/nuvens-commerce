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
} from '@nuvens/ui';

export function WarrantyPage(page: PageTemplateProps) {
  return (
    <div className="min-h-screen">
      <section
        className="relative border-b border-neutral-50 bg-neutral-50 py-16"
        aria-labelledby="warranty-hero"
      >
        <Container className="max-w-5xl text-center">
          <Badge className="mx-auto mb-6 border border-accent-200 bg-accent-50 text-accent-700">
            Warranty
          </Badge>
          <Heading id="warranty-hero" as="h1" align="center">
            Sleep with confidence with our long-term warranty
          </Heading>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-neutral-700">
            Choose with peace of mind. If something goes wrong, we&apos;re here to make it right.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/pages/contact">Start a claim</LocalizedNavLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedNavLink to="/products/matelas-zippex">Browse products</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="warranty-highlights">
        <Container className="max-w-6xl">
          <Heading id="warranty-highlights" as="h2" align="center" className="mb-10">
            What the warranty gives you
          </Heading>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <CardContent className="p-8">
                <h3 className="mb-2 text-lg font-semibold">Extended coverage</h3>
                <p className="text-neutral-700">
                  Long-term protection on core products so you can focus on great sleep.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <h3 className="mb-2 text-lg font-semibold">Helpful support</h3>
                <p className="text-neutral-700">
                  Friendly guidance to solve issues quickly and clearly.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-8">
                <h3 className="mb-2 text-lg font-semibold">Simple process</h3>
                <p className="text-neutral-700">Clear steps from first contact to resolution.</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-primary-600/10 py-16" aria-labelledby="warranty-essentials">
        <Container className="max-w-6xl">
          <Heading
            id="warranty-essentials"
            as="h2"
            align="center"
            className="mb-10 text-primary-800"
          >
            Essentials at a glance
          </Heading>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Coverage examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-800">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                  <p>Mattresses: up to 10 years against structural defects and lasting sag.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                  <p>Toppers and pillows: up to 2 years on materials and seams.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
                  <p>Bases and frames: up to 5 years on structure and hardware.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>What&apos;s not covered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-800">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-600" />
                  <p>Normal wear, comfort preferences, or stains and odors.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-600" />
                  <p>Damage from misuse, improper base, or poor packaging during transport.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-accent-600" />
                  <p>Items repaired or altered without prior approval.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="warranty-steps">
        <Container className="max-w-6xl">
          <Heading id="warranty-steps" as="h2" align="center" className="mb-10">
            How to make a claim
          </Heading>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                1
              </div>
              <p className="text-neutral-700">Gather proof of purchase and your order number.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                2
              </div>
              <p className="text-neutral-700">
                Take clear photos of the issue and the product label.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                3
              </div>
              <p className="text-neutral-700">Contact our team and share the details.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                4
              </div>
              <p className="text-neutral-700">We guide next steps and resolve swiftly.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50 py-16" aria-labelledby="warranty-faq">
        <Container className="max-w-6xl">
          <Heading id="warranty-faq" as="h2" align="center" className="mb-8 text-primary-900">
            Common questions
          </Heading>
          <div className="mx-auto max-w-3xl">
            <Accordion
              type="single"
              items={[
                {
                  title: 'When does the warranty start?',
                  content: 'On the day your order is delivered.',
                },
                {
                  title: 'How long does it last?',
                  content: 'Mattresses up to 10 years; other items vary by category.',
                },
                {
                  title: 'Do I need original packaging?',
                  content:
                    'Keep it if possible. Safe packaging is required to avoid damage during transport.',
                },
                {
                  title: 'Is shipping covered during a claim?',
                  content:
                    'This depends on the case and the product category. Our team confirms before proceeding.',
                },
                {
                  title: 'How long does a resolution take?',
                  content:
                    'After receiving all details, most cases are resolved within a reasonable timeframe.',
                },
              ]}
              defaultValue="0"
              ariaToggleLabel="Toggle"
            />
          </div>
        </Container>
      </section>

      <section className="bg-primary-50 py-16" aria-labelledby="warranty-cta">
        <Container className="max-w-4xl text-center">
          <Heading id="warranty-cta" as="h2" align="center" className="mb-6 text-primary-600">
            Need help with a warranty claim?
          </Heading>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-700">
            Share your order details and photos so we can help quickly and clearly.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/pages/contact">Contact Support</LocalizedNavLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedNavLink to="/products">Browse Products</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

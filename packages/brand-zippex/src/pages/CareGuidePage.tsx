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

export function CareGuidePage(page: PageTemplateProps) {
  return (
    <div className="min-h-screen">
      <section
        className="relative border-b border-neutral-50 bg-neutral-50 py-16"
        aria-labelledby="care-hero"
      >
        <Container className="max-w-5xl text-center">
          <Badge className="mx-auto mb-6 border border-accent-200 bg-accent-50 text-accent-700">
            Care Guide
          </Badge>
          <Heading id="care-hero" as="h1" align="center">
            Keep your mattress fresh for longer
          </Heading>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-neutral-700">
            Simple routines help comfort last. Follow these tips to protect your sleep and your
            warranty.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products/mattress-protector">
                Shop Mattress Protector
              </LocalizedNavLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedNavLink to="/pages/contact">Contact Support</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="care-essentials">
        <Container className="max-w-6xl">
          <Heading id="care-essentials" as="h2" align="center" className="mb-10">
            Essentials at a glance
          </Heading>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Hygiene routine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-800">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Air the room regularly; keep the mattress dry and ventilated.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Vacuum the surface monthly using a clean upholstery nozzle.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Wash removable covers as per label; avoid high heat if not indicated.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Protection &amp; covers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-800">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Use a breathable protector from day one to prevent stains and odors.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Wash sheets and protector regularly; fully dry before reuse.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Avoid plastic wraps that trap moisture.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rotation &amp; support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-800">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Rotate head-to-foot every 1–3 months if your model recommends it.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Do not flip one-sided foam models; follow product guidance.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-primary-600" />
                  <p>Use a compatible, ventilated base to prevent sag and humidity.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-primary-600/10 py-16" aria-labelledby="care-cleaning">
        <Container className="max-w-6xl">
          <Heading id="care-cleaning" as="h2" align="center" className="mb-10 text-primary-800">
            Spot cleaning, step by step
          </Heading>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fresh spills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-neutral-800">
                <p>1. Blot gently with a clean, dry cloth. Do not rub.</p>
                <p>2. Apply a small amount of cold water; keep blotting until clear.</p>
                <p>3. If needed, use a mild soap solution on the cover only.</p>
                <p>4. Air-dry completely before making the bed.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stains &amp; odors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-neutral-800">
                <p>1. Use a mild fabric-safe cleaner; test on a hidden area first.</p>
                <p>2. Avoid soaking foams; moisture must not reach the core.</p>
                <p>3. Neutralize odors with gentle solutions; avoid bleach or solvents.</p>
                <p>4. Ensure full drying and ventilation before sleeping.</p>
              </CardContent>
            </Card>
          </div>
          <p className="mx-auto mt-8 max-w-4xl text-center text-neutral-700">
            If a cover is removable, follow its label. If in doubt, contact support before cleaning.
          </p>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="care-avoid">
        <Container className="max-w-6xl">
          <Heading id="care-avoid" as="h2" align="center" className="mb-10">
            To protect comfort and warranty, avoid
          </Heading>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Common pitfalls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-800">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-600" />
                  <p>Saturating the mattress with water or steam cleaning.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-600" />
                  <p>Using harsh chemicals, bleach, or solvents.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-600" />
                  <p>Covering with non-breathable plastics that trap humidity.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Warranty risks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-800">
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-600" />
                  <p>Using an incompatible or broken base that causes deformation.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-600" />
                  <p>Transporting or storing without adequate packaging.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-600" />
                  <p>Altering the product or removing labels required for service.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <LocalizedNavLink to="/pages/warranty">Read Warranty</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50 py-16" aria-labelledby="care-faq">
        <Container className="max-w-6xl">
          <Heading id="care-faq" as="h2" align="center" className="mb-8 text-primary-900">
            Common questions
          </Heading>
          <div className="mx-auto max-w-3xl">
            <Accordion
              type="single"
              items={[
                {
                  title: 'Do I need a protector?',
                  content:
                    'Yes, it helps prevent stains and odors and keeps the surface hygienic. Choose a breathable protector.',
                },
                {
                  title: 'Can I flip the mattress?',
                  content:
                    'Only if your model is double-sided. Most foam models are single-sided; rotate head-to-foot instead.',
                },
                {
                  title: 'How do I remove a tough stain?',
                  content:
                    'Blot, use a mild cleaner sparingly on the cover, and avoid soaking. If unsure, contact support before proceeding.',
                },
                {
                  title: 'What base should I use?',
                  content:
                    'A flat, compatible, ventilated base that supports the whole surface. Avoid broken or widely spaced slats.',
                },
                {
                  title: 'Will improper care affect my warranty?',
                  content:
                    'Yes. Misuse, inadequate support, or liquid damage can void coverage. See the warranty page for details.',
                },
              ]}
              defaultValue="0"
              ariaToggleLabel="Toggle"
            />
          </div>
        </Container>
      </section>

      <section className="bg-primary-50 py-16" aria-labelledby="care-cta">
        <Container className="max-w-4xl text-center">
          <Heading id="care-cta" as="h2" align="center" className="mb-6 text-primary-600">
            Ready to protect your mattress?
          </Heading>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-neutral-700">
            Add a breathable protector now or talk to our team for the best care plan.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products/mattress-protector">Shop Protector</LocalizedNavLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedNavLink to="/pages/contact">Contact Support</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

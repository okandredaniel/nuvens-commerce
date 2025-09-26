import { type PageTemplateProps } from '@nuvens/core';
import { LocalizedNavLink } from '@nuvens/shopify';
import { Accordion, Badge, Button, Card, CardContent, Container, Heading } from '@nuvens/ui';
import { Clock, Heart, RotateCcw } from 'lucide-react';

export function TrialPage(page: PageTemplateProps) {
  return (
    <div className="min-h-screen">
      <section
        className="relative border-b border-neutral-50 bg-neutral-50 py-16"
        aria-labelledby="hero-heading"
      >
        <Container className="text-center">
          <Badge className="mx-auto mb-6 border border-accent-200 bg-accent-50 text-accent-700">
            100-Night Trial
          </Badge>
          <Heading id="hero-heading" as="h1" align="center">
            Try your mattress at home for up to 100 nights
          </Heading>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-neutral-700">
            We&apos;re here to help you choose with confidence. Settle in, sleep on it, and decide
            without pressure.
          </p>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="highlights-heading">
        <Container className="max-w-6xl">
          <Heading id="highlights-heading" as="h2" align="center" className="sr-only">
            Highlights
          </Heading>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary-50">
                  <Heart className="h-7 w-7 text-primary-700" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Try at home</h3>
                <p className="text-neutral-700">Sleep on it in your routine, not a showroom.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary-50">
                  <Clock className="h-7 w-7 text-primary-700" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No pressure</h3>
                <p className="text-neutral-700">Up to 100 nights to decide.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary-50">
                  <RotateCcw className="h-7 w-7 text-primary-700" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Easy options</h3>
                <p className="text-neutral-700">
                  Keep, exchange, or return if it&apos;s not right.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section
        className="bg-primary-600/10 py-16 text-center"
        aria-labelledby="reassurance-heading"
      >
        <Container className="max-w-3xl">
          <Heading
            id="reassurance-heading"
            as="h2"
            align="center"
            className="mb-3 text-primary-800"
          >
            Take your time to decide
          </Heading>
          <p className="text-lg leading-relaxed text-neutral-700">
            Many sleepers need 2–3 weeks to adapt. The 100-night trial exists so you can feel the
            real difference.
          </p>
        </Container>
      </section>

      <section className="bg-primary-50 py-16" aria-labelledby="essentials-heading">
        <Container className="max-w-5xl">
          <Heading id="essentials-heading" as="h2" align="center" className="mb-8">
            What you need to know
          </Heading>
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
              <p className="leading-relaxed text-neutral-700">
                Duration: up to 100 nights for mattresses.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
              <p className="leading-relaxed text-neutral-700">Trial starts on delivery day.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
              <p className="leading-relaxed text-neutral-700">
                Accessories trial (if applicable): up to 30 nights.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
              <p className="leading-relaxed text-neutral-700">
                Keep items clean and in good condition; a protector is recommended.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
              <p className="leading-relaxed text-neutral-700">One trial per household/address.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-primary-600" />
              <p className="leading-relaxed text-neutral-700">Geographic coverage: France.</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="how-it-works-heading">
        <Container className="max-w-5xl">
          <Heading id="how-it-works-heading" as="h2" align="center" className="mb-8">
            How the 100-night trial works
          </Heading>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                1
              </div>
              <p className="leading-relaxed text-neutral-700">
                Unpack and start your trial the day it&apos;s delivered.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                2
              </div>
              <p className="leading-relaxed text-neutral-700">
                Sleep on it for a few weeks to let your body adjust.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                3
              </div>
              <p className="leading-relaxed text-neutral-700">
                If it&apos;s not right, contact support and we&apos;ll guide next steps.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white">
                4
              </div>
              <p className="leading-relaxed text-neutral-700">
                Choose: exchange or return; refunds are processed within 14 days after
                pickup/receipt.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50/50 py-16" aria-labelledby="outcomes-heading">
        <Container className="max-w-6xl">
          <Heading id="outcomes-heading" as="h2" align="center" className="mb-8">
            Your options during the trial
          </Heading>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <h3 className="mb-3 text-lg font-semibold text-primary-700">Keep it</h3>
                <p className="text-neutral-700">Love it and keep sleeping better.</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <h3 className="mb-3 text-lg font-semibold text-primary-700">Exchange</h3>
                <p className="text-neutral-700">
                  We help you switch to a different firmness or model (if available).
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <h3 className="mb-3 text-lg font-semibold text-primary-700">Return</h3>
                <p className="text-neutral-700">
                  We arrange pickup or provide return instructions. Cost: free pickup by our team.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="py-16" aria-labelledby="faq-heading">
        <Container className="max-w-6xl">
          <Heading id="faq-heading" as="h2" align="center" className="mb-8 text-primary-900">
            Common Questions
          </Heading>
          <div className="mx-auto max-w-3xl">
            <Accordion
              type="single"
              items={[
                {
                  title: 'When does the trial start?',
                  content: 'On the day your order is delivered.',
                },
                {
                  title: 'How long is the trial?',
                  content:
                    'Mattresses: up to 100 nights. Accessories: up to 30 nights (if applicable).',
                },
                {
                  title: 'Do I need original packaging?',
                  content:
                    'Keep it if possible. Items must be returned in good condition with adequate packaging to avoid damage.',
                },
                {
                  title: 'Are returns free?',
                  content: 'Yes, returns are free with pickup arranged by us.',
                },
                {
                  title: 'When will I get my refund?',
                  content: 'Within 14 days after pickup or receipt, once inspected.',
                },
              ]}
              defaultValue="0"
              ariaToggleLabel="Toggle"
            />
          </div>
        </Container>
      </section>

      <section className="bg-primary-50 py-16" aria-labelledby="cta-heading">
        <Container className="max-w-4xl text-center">
          <Heading id="cta-heading" as="h2" align="center" className="mb-6 text-primary-600">
            Ready to start your 100-night trial?
          </Heading>
          <p className="mb-8 text-lg text-neutral-700">
            Choose your mattress and enjoy peace of mind from day one.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="primary">
              <LocalizedNavLink to="/products/matelas-zippex">Shop Now</LocalizedNavLink>
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

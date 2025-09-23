import { LocalizedNavLink } from '@nuvens/shopify';
import { Accordion, Badge, Button, Container, Heading } from '@nuvens/ui';
import { Heart, Moon, Phone, RefreshCw, Shield, Truck } from 'lucide-react';
import { faqItems } from '../../../core/src/mocks/questions';

export function FAQPageTemplate() {
  const features = [
    { icon: Moon, title: '100-Night Trial', description: 'Sleep on it risk-free' },
    { icon: Shield, title: '10-Year Warranty', description: 'Full coverage protection' },
    { icon: Truck, title: 'Free Shipping', description: 'Delivered to your door' },
    { icon: RefreshCw, title: 'Easy Returns', description: 'Hassle-free process' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section aria-labelledby="faq-hero" className="relative bg-neutral-50 py-24 px-4">
        <Container className="text-center">
          <Badge className="mx-auto mb-6">Frequently Asked Questions</Badge>
          <Heading id="faq-hero" as="h1" align="center">
            Everything you need to know about your perfect night&apos;s sleep
          </Heading>
          <p className="mx-auto mt-4 max-w-2xl text-xl leading-relaxed text-neutral-600">
            We&apos;ve answered the most common questions about our mattress, shipping, and
            policies. Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
          </p>
        </Container>
      </section>

      <section className="py-16 px-4 bg-card/30">
        <Container className="max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary-100">
                  <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 px-4">
        <Container className="max-w-4xl space-y-16">
          <div>
            <Heading as="h2" align="center">
              About Our Mattress
            </Heading>
            <Accordion
              type="single"
              items={faqItems ?? []}
              defaultValue="0"
              ariaToggleLabel="Alternar"
            />
          </div>

          <div>
            <Heading as="h2" align="center">
              Shipping & Delivery
            </Heading>
            <Accordion
              type="single"
              items={faqItems ?? []}
              defaultValue="0"
              ariaToggleLabel="Alternar"
            />
          </div>

          <div>
            <Heading as="h2" align="center">
              Trial & Warranty
            </Heading>
            <Accordion
              type="single"
              items={faqItems ?? []}
              defaultValue="0"
              ariaToggleLabel="Alternar"
            />
          </div>

          <div>
            <Heading as="h2" align="center">
              Care & Maintenance
            </Heading>
            <Accordion
              type="single"
              items={faqItems ?? []}
              defaultValue="0"
              ariaToggleLabel="Alternar"
            />
          </div>

          <div>
            <Heading as="h2" align="center">
              Urgent Issues & Claims
            </Heading>
            <Accordion
              type="single"
              items={faqItems ?? []}
              defaultValue="0"
              ariaToggleLabel="Alternar"
            />
          </div>
        </Container>
      </section>

      <section className="bg-sky-600 py-20 px-4 text-primary-50">
        <Container className="max-w-4xl text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary-600">
            <Heart className="h-8 w-8" aria-hidden="true" />
          </div>
          <Heading as="h2" align="center" className="text-inherit">
            Still have questions?
          </Heading>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90 text-pretty">
            Our sleep experts are here to help you find your perfect night&apos;s rest. Get in touch
            and we&apos;ll answer any questions you have.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="primary" surface="dark">
              <LocalizedNavLink to="/pages/contact">
                <Phone className="mr-2 h-4 w-4" />
                Contact us
              </LocalizedNavLink>
            </Button>
            <Button asChild size="lg" variant="outline" surface="dark">
              <LocalizedNavLink to="/pages/contact">Send us an e-mail</LocalizedNavLink>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

import { type PageTemplateProps } from '@nuvens/core';
import { LocalizedNavLink } from '@nuvens/shopify';
import {
  Accordion,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  Heading,
  Input,
  Textarea,
} from '@nuvens/ui';
import { Clock, Heart, HelpCircle, Mail, MessageSquare, RotateCcw } from 'lucide-react';

export function DeliveryReturnsPage(page: PageTemplateProps) {
  return (
    <div className="min-h-screen">
      <section
        aria-labelledby="delivery-hero"
        className="relative border-b border-neutral-50 py-16"
      >
        <Container className="flex flex-col text-center">
          <Badge className="mx-auto mb-6 border border-accent-200 bg-accent-50 text-accent-700">
            Delivery &amp; Returns
          </Badge>
          <Heading id="delivery-hero" as="h1" align="center">
            Delivery &amp; Returns
          </Heading>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-neural-700">
            We&apos;re here to support you every step of the way. Your satisfaction is our priority.
          </p>
        </Container>
      </section>

      <section aria-labelledby="delivery-highlights" className="py-16 px-4">
        <Container>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Heart, title: '100 Night Trial', text: 'Take your time to decide' },
              { icon: Clock, title: 'Fast Support', text: 'Quick response to your needs' },
              { icon: RotateCcw, title: 'Hassle-Free Process', text: 'Simple and straightforward' },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title} className="text-center">
                <CardContent className="p-8">
                  <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-primary-50">
                    <Icon className="h-7 w-7 text-primary-700" aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                  <p className="text-neural-700">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="delivery-trial"
        className="bg-primary-600/10 py-16 px-4 text-center"
      >
        <Container className="max-w-3xl">
          <Heading id="delivery-trial" as="h2" align="center" className="mb-3 text-primary-800">
            Take Your Time to Decide
          </Heading>
          <p className="text-neural-800">
            Your body may need up to two weeks to adapt to new bedding products. That&apos;s why we
            offer you 100 nights to try our products. Don&apos;t rush — enjoy your trial period.
          </p>
        </Container>
      </section>

      <section aria-labelledby="delivery-help" className="py-16 px-4">
        <Container>
          <Heading id="delivery-help" as="h2" className="mb-8">
            We&apos;re Here to Help
          </Heading>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary-700" />
                Before Considering a Return
              </CardTitle>
              <CardDescription>
                Let&apos;s find a solution together. Every return requires resources, and we&apos;d
                love to help you in a more sustainable way first.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neural-700 mb-4">
                Many concerns can be resolved with simple adjustments or by giving your body more
                time to adapt. Our support team has helped thousands of customers find the perfect
                comfort level.
              </p>
              <Button asChild variant="outline" className="sm:w-auto">
                <LocalizedNavLink to="/pages/contact">Visit Our Help Center</LocalizedNavLink>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section aria-labelledby="delivery-promise" className="bg-accent-50 py-16 px-4">
        <Container>
          <Heading id="delivery-promise" as="h2" align="center" className="mb-10">
            Our Promise to You
          </Heading>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>100-Night Satisfaction Guarantee</CardTitle>
              <CardDescription>
                We believe you&apos;ll love your Zippex products. If for any reason you&apos;re not
                completely satisfied, we&apos;re here to make it right.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-10 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-semibold text-neural-900">What we offer</h4>
                  <ul className="space-y-2 text-neural-800">
                    {[
                      '100 nights to try your product',
                      'Personal support throughout your trial',
                      'Flexible solutions for your comfort',
                      'Peace of mind with every purchase',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-600"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 font-semibold text-neural-900">How we support you</h4>
                  <ol className="space-y-2 text-neural-800">
                    {[
                      'Reach out to our caring team',
                      'We&apos;ll explore solutions together',
                      'If needed, we&apos;ll arrange collection',
                      'Full refund processed quickly',
                    ].map((step, i) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-700 text-white text-sm">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>

      <section aria-labelledby="delivery-contact" className="py-16 px-4">
        <Container>
          <Heading id="delivery-contact" as="h2" className="mb-8">
            Get in Touch
          </Heading>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary-700" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Tell us about your experience or any concerns you have. We&apos;re here to help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                        First Name
                      </label>
                      <Input id="firstName" placeholder="Your first name" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Your last name" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <label htmlFor="orderNumber" className="mb-1 block text-sm font-medium">
                      Order Number (Optional)
                    </label>
                    <Input id="orderNumber" placeholder="ZX-12345" />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1 block text-sm font-medium">
                      How can we help?
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your experience or what you need help with..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary-700" />
                  Direct Contact
                </CardTitle>
                <CardDescription>
                  Prefer to reach out directly? We&apos;re available through multiple channels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-2 font-semibold">Email Support</h4>
                  <p className="mb-2 text-neural-800">support@zippex.com</p>
                  <p className="text-sm text-neural-700">We typically respond within 24 hours</p>
                </div>
                <div className="h-px bg-neural-200" />
                <div>
                  <h4 className="mb-2 font-semibold">Customer Care Hours</h4>
                  <div className="space-y-1 text-neural-700">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                <div className="h-px bg-neural-200" />
                <div>
                  <h4 className="mb-2 font-semibold">Response Time</h4>
                  <p className="text-neural-700">
                    Our dedicated support team aims to respond to all inquiries within 24 hours,
                    often much sooner during business hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section aria-labelledby="delivery-faq" className="py-16">
        <Container>
          <Heading id="delivery-faq" as="h2" className="mb-8 text-primary-900">
            Common Questions
          </Heading>
          <Accordion
            type="single"
            items={[
              {
                title: 'How long should I try my product before deciding?',
                content:
                  'We recommend giving your body at least 2–3 weeks to adjust to new bedding products. Your comfort preferences may change as you adapt, and we are here to support you throughout the process.',
              },
              {
                title: 'What if I&apos;m not completely satisfied?',
                content:
                  'Your satisfaction is our priority. Contact our support team and we&apos;ll work together to find the best solution. Whether that&apos;s adjusting your setup, trying different products, or processing a return.',
              },
              {
                title: 'Is the return process really hassle-free?',
                content:
                  'Absolutely. We handle all the logistics, from scheduling pickup to processing your refund, and guide you through each step.',
              },
              {
                title: 'Can you help me choose the right product?',
                content:
                  'Of course. Our sleep experts can help you find the perfect match for your needs. Share your preferences and sleeping habits and we will provide recommendations.',
              },
            ]}
            defaultValue="0"
            ariaToggleLabel="Toggle"
          />
        </Container>
      </section>

      <section aria-labelledby="delivery-cta" className="bg-primary-50 py-16 px-4">
        <Container className="max-w-4xl text-center">
          <Heading id="delivery-cta" as="h2" align="center" className="mb-6 text-primary-600">
            Ready to start your 100-night trial?
          </Heading>
          <p className="mb-8 text-lg">Choose your Zippex and enjoy peace of mind from day one.</p>
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

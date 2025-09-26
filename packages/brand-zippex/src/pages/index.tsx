import type { ImageProps, PageTemplateProps } from '@nuvens/core';
import { AboutPageTemplate } from './AboutPageTemplate';
import { ContactSupportTemplate } from './ContactSupportTemplate';
import DeliveryReturnsPage from './DeliveryReturns';
import { FAQPageTemplate } from './FAQPageTemplate';
import ReviewsPageTemplate from './ReviewsPageTemplate';

export const pageTemplates: Record<string, (props: PageTemplateProps & any) => JSX.Element> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'about-us': () => <AboutPageTemplate />,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'delivery-returns': () => <DeliveryReturnsPage />,
  contact: (props: PageTemplateProps) => <ContactSupportTemplate {...props} />,
  faq: () => <FAQPageTemplate />,
  reviews: (props: PageTemplateProps & { Image: ImageProps }) => <ReviewsPageTemplate {...props} />,
};

export * from './home';
export * from './product';

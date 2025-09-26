import type { ImageProps, PageTemplateProps } from '@nuvens/core';
import { AboutPageTemplate } from './AboutPage';
import { CareGuidePage } from './CareGuidePage';
import { ContactSupportTemplate } from './ContactSupportPage';
import { DeliveryReturnsPage } from './DeliveryReturnsPage';
import { FAQPageTemplate } from './FAQPage';
import { MadeInEuropePage } from './MadeInEuropePage';
import { ReviewsPageTemplate } from './ReviewsPageTemplate';
import { SustainabilityPage } from './SustainabilityPage';
import TechnologyPage from './TechnologyPage';
import { TrialPage } from './TrialPage';
import { WarrantyPage } from './WarrantyPage';

export const pageTemplates = new Map([
  ['100-night-trial', (props: PageTemplateProps) => <TrialPage {...props} />],
  ['about-us', (props: PageTemplateProps) => <AboutPageTemplate {...props} />],
  ['care-guide', (props: PageTemplateProps) => <CareGuidePage {...props} />],
  ['delivery-returns', (props: PageTemplateProps) => <DeliveryReturnsPage {...props} />],
  ['made-in-europe', (props: PageTemplateProps) => <MadeInEuropePage {...props} />],
  ['contact', (props: PageTemplateProps) => <ContactSupportTemplate {...props} />],
  ['faq', (props: PageTemplateProps) => <FAQPageTemplate {...props} />],
  [
    'reviews',
    ({ Image, ...props }: PageTemplateProps & { Image: ImageProps }) => (
      <ReviewsPageTemplate Image={Image} {...props} />
    ),
  ],
  ['sustainability', (props: PageTemplateProps) => <SustainabilityPage {...props} />],
  ['technology', (props: PageTemplateProps) => <TechnologyPage {...props} />],
  ['warranty', (props: PageTemplateProps) => <WarrantyPage {...props} />],
]);

export * from './HomePage';
export * from './ProductPage';

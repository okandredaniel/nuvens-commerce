import { Container } from '@nuvens/ui-core';
import { useTranslation } from 'react-i18next';
import { Newsletter } from '~/components/Newsletter';
import { ChannelsGrid } from './contact/ChannelsGrid';
import { CompanyInfo } from './contact/CompanyInfo';
import { Hero } from './contact/Hero';
import { QuickActions } from './contact/QuickActions';
import { ReturnsPortal } from './contact/ReturnsPortal';
import { SelfServiceGrid } from './contact/SelfServiceGrid';
import { SupportHours } from './contact/SupportHours';

type Page = { id: string; handle: string; title: string; body: string };
type PageTemplateProps = { page: Page };

export function ContactSupportTemplate({ page }: PageTemplateProps) {
  const { t: tSupport } = useTranslation('support');

  return (
    <main id="content" role="main" className="bg-[color:var(--color-surface)]">
      <div className="border-b border-[color:var(--color-border)] py-8">
        <Hero />
      </div>

      <Container className="py-8">
        {page.body && (
          <div
            className="prose max-w-none prose-headings:font-semibold prose-a:underline prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />
        )}

        <div className="py-8">
          <QuickActions />
        </div>

        <div className="py-8">
          <SelfServiceGrid />
        </div>

        <div className="py-8">
          <ChannelsGrid />
        </div>

        <div className="py-8">
          <SupportHours />
        </div>

        <div className="grid gap-8 lg:grid-cols-2 py-8">
          <CompanyInfo />
          <ReturnsPortal />
        </div>
      </Container>
      <div className="pt-8">
        <Newsletter />
      </div>
    </main>
  );
}

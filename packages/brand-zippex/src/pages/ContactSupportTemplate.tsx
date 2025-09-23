import type { PageTemplateProps } from '@nuvens/core';
import { Container } from '@nuvens/ui';
import { ChannelsGrid } from './contact/ChannelsGrid';
import { CompanyInfo } from './contact/CompanyInfo';
import { Hero } from './contact/Hero';
import { QuickActions } from './contact/QuickActions';
import { ReturnsPortal } from './contact/ReturnsPortal';
import { SelfServiceGrid } from './contact/SelfServiceGrid';
import { SupportHours } from './contact/SupportHours';

export function ContactSupportTemplate(page: PageTemplateProps) {
  return (
    <main id="content" role="main" className="bg-neutral-0">
      <div className="border-b border-neutral-200 py-8">
        <Hero />
      </div>

      <Container className="py-8">
        {page.body && (
          <div
            className="prose prose-neutral max-w-none prose-headings:font-semibold prose-a:underline prose-img:rounded-xl"
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

        <div className="grid gap-8 py-8 lg:grid-cols-2">
          <CompanyInfo />
          <ReturnsPortal />
        </div>
      </Container>
    </main>
  );
}

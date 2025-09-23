import { Container, Heading } from '@nuvens/ui';

type Page = { id: string; handle: string; title: string; body: string };

type PageTemplateProps = {
  page: Page;
};

export function DefaultPageTemplate({ page }: PageTemplateProps) {
  return (
    <main id="content" role="main" className="bg-[color:var(--color-surface)]">
      <header>
        <Container className="py-8 md:py-10 border-b border-[color:var(--color-border)]">
          <Heading as="h1" data-page-handle={page.handle}>
            {page.title}
          </Heading>
        </Container>
      </header>

      <Container className="py-6 md:py-10">
        <article
          aria-labelledby="content"
          className="prose max-w-none prose-headings:font-semibold prose-a:underline prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </Container>
    </main>
  );
}

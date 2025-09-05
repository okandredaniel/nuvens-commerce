import { Container } from '@nuvens/ui-core';

type Page = { id: string; handle: string; title: string; body: string };

type PageTemplateProps = {
  page: Page;
};

export function DefaultPageTemplate({ page }: PageTemplateProps) {
  return (
    <main id="content" role="main" className="bg-[color:var(--color-surface)]">
      <header>
        <Container className="py-8 md:py-10 border-b border-[color:var(--color-border)]">
          <h1
            className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--color-on-surface)]"
            data-page-handle={page.handle}
          >
            {page.title}
          </h1>
        </Container>
      </header>

      <Container className="py-6 md:py-10">
        <article
          aria-labelledby="content"
          className="prose max-w-none prose-headings:font-semibold prose-a:underline prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: page.body }}
        />
      </Container>
    </main>
  );
}

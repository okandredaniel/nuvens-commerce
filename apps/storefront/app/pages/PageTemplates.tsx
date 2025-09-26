import { DefaultPageTemplate } from './DefaultPageTemplate';

type Page = { id: string; handle: string; title: string; body: string };
type PageTemplateProps = { page: Page; Image?: unknown };

export const pageTemplates = new Map<string, (props: PageTemplateProps) => JSX.Element>([
  ['default', (props) => <DefaultPageTemplate {...props} />],
]);

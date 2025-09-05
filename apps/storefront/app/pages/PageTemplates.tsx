import { DefaultPageTemplate } from './DefaultPageTemplate';

type Page = { id: string; handle: string; title: string; body: string };

type PageTemplateProps = {
  page: Page;
  children?: React.ReactNode;
};

export const pageTemplates: Record<string, (props: PageTemplateProps) => JSX.Element> = {
  default: (props) => <DefaultPageTemplate {...props} />,
};

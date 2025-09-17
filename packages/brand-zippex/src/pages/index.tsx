import { AboutPage } from './about';

type Page = { id: string; handle: string; title: string; body: string };
type PageTemplateProps = { page: Page };

export const pageTemplates: Record<string, (props: PageTemplateProps) => JSX.Element> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'about-us': () => <AboutPage />,
};

export * from './home';
export * from './product';

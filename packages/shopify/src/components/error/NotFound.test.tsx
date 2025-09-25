import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundView } from './NotFound';

vi.mock('@nuvens/ui', () => {
  const Button = ({ asChild, children, ...rest }: any) =>
    asChild ? <>{children}</> : <button {...rest}>{children}</button>;
  const Card = ({ children, ...rest }: any) => (
    <div role="article" {...rest}>
      {children}
    </div>
  );
  const CardContent = ({ children, ...rest }: any) => <div {...rest}>{children}</div>;
  const Container = ({ children, ...rest }: any) => <div {...rest}>{children}</div>;
  const Heading = ({ as: Tag = 'h2', children, ...rest }: any) => <Tag {...rest}>{children}</Tag>;
  return { Button, Card, CardContent, Container, Heading };
});

vi.mock('lucide-react', () => ({
  ArrowLeft: (p: any) => <span data-testid="icon-back" {...p} />,
  Home: (p: any) => <span data-testid="icon-home" {...p} />,
  MessageCircle: (p: any) => <span data-testid="icon-contact" {...p} />,
  Search: (p: any) => <span data-testid="icon-search" {...p} />,
}));

vi.mock('../LocalizedLink', () => ({
  LocalizedLink: ({ to, children, ...rest }: any) => (
    <a href={typeof to === 'string' ? to : String(to)} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const hoisted = vi.hoisted(() => ({
  navigateSpy: vi.fn(),
}));

vi.mock('react-router', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router')>();
  return { ...mod, useNavigate: () => hoisted.navigateSpy };
});

describe('NotFoundView', () => {
  beforeEach(() => {
    hoisted.navigateSpy.mockReset();
  });

  it('renders the main structure with hero and 404 indicator', () => {
    render(<NotFoundView />);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'content');
    expect(screen.getAllByText('404')[0]).toBeInTheDocument();
    expect(screen.getAllByTestId('icon-search').length).toBeGreaterThan(0);
  });

  it('shows title, subtitle and primary home action', () => {
    render(<NotFoundView />);
    expect(screen.getByRole('heading', { level: 1, name: 'title' })).toBeInTheDocument();
    expect(screen.getByText('subtitle')).toBeInTheDocument();
    const homeLink = screen.getByRole('link', { name: 'actions.home' });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(screen.getByTestId('icon-home')).toBeInTheDocument();
  });

  it('renders contact and search cards with correct links and texts', () => {
    render(<NotFoundView />);
    const contact = screen.getByRole('link', { name: 'cards.contact.title' });
    expect(contact).toHaveAttribute('href', '/pages/contact');
    expect(screen.getByText('cards.contact.desc')).toBeInTheDocument();
    const search = screen.getByRole('link', { name: 'cards.search.title' });
    expect(search).toHaveAttribute('href', '/search');
    expect(screen.getByText('cards.search.desc')).toBeInTheDocument();
    expect(screen.getByTestId('icon-contact')).toBeInTheDocument();
    expect(screen.getAllByTestId('icon-search')[0]).toBeInTheDocument();
  });

  it('navigates back when clicking the back card button', () => {
    render(<NotFoundView />);
    const backBtn = screen.getByRole('button', { name: 'cards.back.title' });
    fireEvent.click(backBtn);
    expect(hoisted.navigateSpy).toHaveBeenCalledWith(-1);
    expect(screen.getByTestId('icon-back')).toBeInTheDocument();
  });

  it('renders footer nav links with correct hrefs and labels', () => {
    render(<NotFoundView />);
    expect(screen.getByRole('navigation', { name: 'links.aria' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'links.privacy' })).toHaveAttribute(
      'href',
      '/policies/privacy-policy',
    );
    expect(screen.getByRole('link', { name: 'links.terms' })).toHaveAttribute(
      'href',
      '/policies/terms-of-service',
    );
    expect(screen.getByRole('link', { name: 'links.help' })).toHaveAttribute('href', '/pages/help');
  });
});

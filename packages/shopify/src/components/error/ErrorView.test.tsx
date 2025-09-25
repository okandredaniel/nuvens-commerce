import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => {
  const Button = ({ asChild, children, ...rest }: any) =>
    asChild ? <>{children}</> : <button {...rest}>{children}</button>;
  const Container = ({ children, ...rest }: any) => <div {...rest}>{children}</div>;
  return { Button, Container };
});

vi.mock('lucide-react', () => ({
  Home: (props: any) => <span data-testid="home-icon" {...props} />,
}));

vi.mock('../LocalizedLink', () => ({
  LocalizedLink: ({ to, children, ...rest }: any) => (
    <a href={typeof to === 'string' ? to : String(to)} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => {
      if (k === 'errors.title') return 'Something went wrong';
      if (k === 'actions.home') return 'Go home';
      return k;
    },
  }),
}));

import { ErrorView } from './ErrorView';

describe('ErrorView', () => {
  it('renders status code, translated title, and message when provided', () => {
    render(<ErrorView status={404} message="Not found" />);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'content');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('renders a localized home link wrapped by Button asChild', () => {
    render(<ErrorView status={500} message="Kaboom" />);
    const link = screen.getByRole('link', { name: /Go home/i });
    expect(link).toHaveAttribute('href', '/');
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('omits the message paragraph when message is empty', () => {
    render(<ErrorView status={500} message="" />);
    expect(screen.queryByText(/.+/i, { selector: 'p' })).not.toBeInTheDocument();
  });
});

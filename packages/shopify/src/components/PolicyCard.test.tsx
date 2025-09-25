import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => ({
  Card: (p: any) => <div data-testid="card" {...p} />,
  CardContent: (p: any) => <div data-testid="card-content" {...p} />,
}));

vi.mock('lucide-react', () => ({
  FileText: (p: any) => <span data-testid="icon-filetext" {...p} />,
  RotateCcw: (p: any) => <span data-testid="icon-rotateccw" {...p} />,
  ScrollText: (p: any) => <span data-testid="icon-scrolltext" {...p} />,
  Shield: (p: any) => <span data-testid="icon-shield" {...p} />,
  Truck: (p: any) => <span data-testid="icon-truck" {...p} />,
}));

vi.mock('./LocalizedLink', () => ({
  LocalizedLink: (p: any) => (
    <a
      data-testid="link"
      href={typeof p.to === 'string' ? p.to : String(p.to)}
      aria-label={p['aria-label']}
      className={p.className}
    >
      {p.children}
    </a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => ({
    t: (k: string, opts?: any) => {
      const key = ns ? `${ns}:${k}` : k;
      if (key === 'policies:cards.read') return `Read ${opts?.title ?? ''}`.trim();
      return key;
    },
  }),
}));

async function load() {
  const mod = await import('./PolicyCard');
  return mod.PolicyCard;
}

describe('PolicyCard', () => {
  it('renders mapped icon, title, aria-label and link for known handle', async () => {
    const PolicyCard = await load();
    render(<PolicyCard policy={{ id: '1', title: 'Refund Policy', handle: 'refund-policy' }} />);

    expect(screen.getByTestId('link')).toHaveAttribute('href', '/policies/refund-policy');
    expect(screen.getByTestId('link')).toHaveAttribute('aria-label', 'Read Refund Policy');

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Refund Policy');
    expect(screen.getByText('Read refund policy')).toBeInTheDocument();

    expect(screen.getByTestId('icon-rotateccw')).toBeInTheDocument();
  });

  it('falls back to default icon and still renders link and texts for unknown handle', async () => {
    const PolicyCard = await load();
    render(<PolicyCard policy={{ id: '2', title: 'Custom Policy', handle: 'unknown-handle' }} />);

    expect(screen.getByTestId('link')).toHaveAttribute('href', '/policies/unknown-handle');
    expect(screen.getByTestId('link')).toHaveAttribute('aria-label', 'Read Custom Policy');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Custom Policy');
    expect(screen.getByText('Read custom policy')).toBeInTheDocument();
    expect(screen.getByTestId('icon-filetext')).toBeInTheDocument();
  });

  it('normalizes handle case before icon selection', async () => {
    const PolicyCard = await load();
    render(
      <PolicyCard policy={{ id: '3', title: 'Shipping Policy', handle: 'Shipping-Policy' }} />,
    );

    expect(screen.getByTestId('link')).toHaveAttribute('href', '/policies/Shipping-Policy');
    expect(screen.getByTestId('icon-truck')).toBeInTheDocument();
  });
});

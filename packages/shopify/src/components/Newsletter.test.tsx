import { cleanup, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/ui', () => ({
  Button: (p: any) => (
    <button data-testid="btn" {...p}>
      {p.children}
    </button>
  ),
  Checkbox: (p: any) => <input data-testid="cb" type="checkbox" {...p} />,
  Heading: (p: any) => {
    const Tag = p.as || 'h2';
    return (
      <Tag data-testid="heading" className={p.className} {...p}>
        {p.children}
      </Tag>
    );
  },
  Input: (p: any) => <input data-testid="input" {...p} />,
  Label: (p: any) => (
    <label data-testid="label" {...p}>
      {p.children}
    </label>
  ),
}));
vi.mock('lucide-react', () => ({ ChevronRight: () => <span data-testid="icon" /> }));

const i18nStore = new Map<string, string>([
  ['newsletter:title', 'Join our newsletter'],
  ['newsletter:emailLabel', 'Email'],
  ['newsletter:emailPlaceholder', 'you@example.com'],
  ['newsletter:cta', 'Subscribe'],
  ['newsletter:consent', 'I agree'],
  ['newsletter:disclaimer.part1', 'By subscribing you accept our'],
  ['newsletter:disclaimer.privacy', 'Privacy Policy'],
  ['newsletter:disclaimer.part2', 'and terms.'],
  ['newsletter:subtitle', 'No spam.'],
  ['newsletter:action', '/api/newsletter'],
  ['newsletter:privacy.href', '/privacy'],
]);

const i18nAPI = {
  exists: (k: string) => i18nStore.has(k),
  t: (k: string) => i18nStore.get(k) ?? k,
};

vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => ({
    t: (k: string) => (ns ? i18nAPI.t(`${ns}:${k}`) : i18nAPI.t(k)),
    i18n: { exists: (k: string) => i18nAPI.exists(k) },
  }),
}));

async function load() {
  const mod = await import('./Newsletter');
  return mod.Newsletter;
}

describe('Newsletter', () => {
  it('renders title, form, inputs, and actions when translations exist', async () => {
    i18nStore.set('newsletter:action', '/api/newsletter');
    i18nStore.set('newsletter:privacy.href', '/privacy');
    i18nStore.set('newsletter:subtitle', 'No spam.');

    const Newsletter = await load();
    const { container } = render(<Newsletter />);

    expect(screen.getByTestId('heading')).toHaveTextContent('Join our newsletter');

    const form = container.querySelector('form') as HTMLFormElement;
    expect(form).toBeTruthy();
    expect(form.getAttribute('action')).toBe('/api/newsletter');

    const email = screen.getByTestId('input') as HTMLInputElement;
    expect(email).toHaveAttribute('id', 'newsletter-email');
    expect(email).toHaveAttribute('name', 'email');
    expect(email).toHaveAttribute('type', 'email');
    expect(email).toHaveAttribute('autocomplete', 'email');
    expect(email).toHaveAttribute('placeholder', 'you@example.com');

    const iconBtn = screen.getAllByTestId('btn')[0];
    expect(iconBtn).toHaveAttribute('type', 'submit');
    expect(iconBtn).toHaveAttribute('aria-label', 'Subscribe');
    expect(iconBtn).toHaveAttribute('title', 'Subscribe');

    const ctaBtn = screen.getAllByTestId('btn')[1];
    expect(ctaBtn).toHaveTextContent('Subscribe');

    expect(screen.getByText('I agree')).toBeInTheDocument();
    expect(screen.getByText(/By subscribing you accept our/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute(
      'href',
      '/privacy',
    );
    expect(screen.getByText(/and terms\./)).toBeInTheDocument();
    expect(screen.getByText('No spam.')).toBeInTheDocument();
  });

  it('omits action, uses # for privacy, and hides subtitle when keys are missing', async () => {
    i18nStore.delete('newsletter:action');
    i18nStore.delete('newsletter:privacy.href');
    i18nStore.delete('newsletter:subtitle');

    const Newsletter = await load();
    const { container } = render(<Newsletter />);

    const form = container.querySelector('form') as HTMLFormElement | null;
    expect(form).toBeTruthy();
    expect(form?.hasAttribute('action')).toBe(false);
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '#');
    expect(screen.queryByText('No spam.')).toBeNull();
  });

  it('applies dark and light tone classes to key elements', async () => {
    if (!i18nStore.has('newsletter:subtitle')) i18nStore.set('newsletter:subtitle', 'No spam.');
    const Newsletter = await load();

    const r1 = render(<Newsletter tone="onDark" />);
    expect(screen.getByTestId('heading').getAttribute('class') || '').toContain('text-neutral-0');
    r1.unmount();

    const r2 = render(<Newsletter tone="default" />);
    expect(screen.getByTestId('heading').getAttribute('class') || '').toContain('text-neutral-900');
    const labels = screen.getAllByTestId('label');
    const consentLabel = labels.find((el) => el.textContent === 'I agree') as HTMLLabelElement;
    expect(consentLabel.getAttribute('class') || '').toMatch(/text-neutral-(0|900)/);
    r2.unmount();

    cleanup();
  });
});

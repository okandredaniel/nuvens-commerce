import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MenuButton } from './MenuButton';

const hoisted = vi.hoisted(() => ({
  openSpy: vi.fn(),
}));

vi.mock('@nuvens/ui', () => ({
  Button: ({ children, ...rest }: any) => (
    <button data-testid="btn" {...rest}>
      {children}
    </button>
  ),
  Tooltip: {
    Root: ({ children }: any) => <div data-testid="tt-root">{children}</div>,
    Trigger: ({ children, asChild }: any) =>
      asChild ? <>{children}</> : <button data-testid="tt-trigger">{children}</button>,
    Content: ({ children, sideOffset }: any) => (
      <div data-testid="tt-content" data-side-offset={sideOffset}>
        {children}
      </div>
    ),
    Arrow: () => <div data-testid="tt-arrow" />,
  },
  useAside: () => ({ open: hoisted.openSpy }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => {
      if (k === 'nav.menu') return 'Menu';
      if (k === 'nav.openMenu') return 'Open menu';
      return k;
    },
  }),
}));

describe('MenuButton', () => {
  it('renders button with aria-label and tooltip content', () => {
    render(<MenuButton />);
    const btn = screen.getByRole('button', { name: 'Open menu' });
    expect(btn).toBeInTheDocument();
    expect(screen.getByTestId('tt-content')).toHaveTextContent('Menu');
  });

  it('opens mobile aside when clicked', async () => {
    const user = userEvent.setup();
    render(<MenuButton />);
    const btn = screen.getByRole('button', { name: 'Open menu' });
    await user.click(btn);
    expect(hoisted.openSpy).toHaveBeenCalledWith('mobile');
  });
});

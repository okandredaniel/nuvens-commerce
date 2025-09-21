import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button by default', () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('renders as anchor when href is provided', () => {
    render(
      <Button href="https://example.com" target="_blank">
        Go
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('prevents clicks when disabled on non-native element', () => {
    const onClick = vi.fn();
    render(
      <Button href="https://example.com" disabled onClick={onClick}>
        Go
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });
});

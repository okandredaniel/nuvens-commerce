import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders as span by default with base, neutral variant and md size classes', () => {
    render(<Badge>Label</Badge>);
    const el = screen.getByText('Label');
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('inline-flex');
    expect(el).toHaveClass('ui-radius');
    expect(el.className).toContain('bg-neutral-0');
    expect(el.className).toContain('border-neutral-200');
    expect(el.className).toContain('text-neutral-600');
    expect(el.className).toContain('px-4');
    expect(el.className).toContain('py-2');
    expect(el.className).toContain('text-sm');
  });

  it('renders as custom element with "as" prop', () => {
    render(<Badge as="div">Label</Badge>);
    const el = screen.getByText('Label');
    expect(el.tagName).toBe('DIV');
  });

  it('applies classes to child when using asChild', () => {
    render(
      <Badge asChild>
        <a href="#x">Go</a>
      </Badge>,
    );
    const el = screen.getByRole('link', { name: 'Go' });
    expect(el).toHaveClass('inline-flex');
    expect(el.className).toMatch(/px-4/);
  });

  it('merges custom className', () => {
    render(<Badge className="extra">Label</Badge>);
    expect(screen.getByText('Label').className).toContain('extra');
  });

  it('forwards ref to the rendered element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('spreads arbitrary props', () => {
    render(
      <Badge role="status" aria-label="Badge status" tabIndex={0}>
        Status
      </Badge>,
    );
    const el = screen.getByRole('status', { name: 'Badge status' });
    expect(el).toHaveAttribute('tabindex', '0');
  });

  it.each([
    ['neutral', 'bg-neutral-0'],
    ['brand', 'bg-primary-600/10'],
    ['outline', 'hover:bg-neutral-0/10'],
  ] as const)('applies variant classes: %s', (variant, expected) => {
    render(<Badge variant={variant as any}>V</Badge>);
    expect(screen.getByText('V').className).toContain(expected);
  });

  it.each([
    ['sm', 'text-xs'],
    ['md', 'text-sm'],
    ['lg', 'text-base'],
  ] as const)('applies size classes: %s', (size, expected) => {
    render(<Badge size={size as any}>S</Badge>);
    expect(screen.getByText('S').className).toContain(expected);
  });
});

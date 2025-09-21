import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native button by default', () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('respects custom type for native button', () => {
    render(<Button type="submit">Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn).toHaveAttribute('type', 'submit');
  });

  it('merges custom class names', () => {
    render(<Button className="custom-class">Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn.className).toContain('custom-class');
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
    expect(link).not.toHaveAttribute('type');
  });

  it('renders as anchor when using the "as" prop', () => {
    render(
      <Button as="a" href="#test">
        Go
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('href', '#test');
  });

  it('preserves explicit rel when provided with target _blank', () => {
    render(
      <Button href="https://example.com" target="_blank" rel="nofollow">
        Go
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toHaveAttribute('rel', 'nofollow');
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

  it('disables native button using disabled attribute', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
    expect(btn).not.toHaveAttribute('aria-disabled');
    expect(btn).not.toHaveAttribute('tabindex', '-1');
  });

  it('fires onClick when enabled (button)', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('fires onClick when enabled (anchor)', () => {
    const onClick = vi.fn();
    render(
      <Button as="a" href="#ok" onClick={onClick}>
        Go
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the rendered element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Go</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.tagName).toBe('BUTTON');
  });

  it('supports asChild and applies classes to child', () => {
    render(
      <Button asChild>
        <a href="#child">Go</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link.className).toMatch(/inline-flex/);
  });

  it('prevents clicks when disabled with asChild', () => {
    const onClick = vi.fn();
    render(
      <Button asChild disabled onClick={onClick}>
        <a href="#child">Go</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
  });

  it.each([
    ['primary', 'bg-primary-600'],
    ['secondary', 'bg-neutral-400'],
    ['white', 'bg-neutral-0'],
    ['outline', 'border-neutral-600/50'],
    ['ghost', 'bg-transparent'],
  ] as const)('applies variant classes: %s', (variant, expected) => {
    render(<Button variant={variant}>Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn.className).toContain(expected);
  });

  it.each([
    ['sm', 'h-9'],
    ['md', 'h-10'],
    ['lg', 'h-11'],
  ] as const)('applies size classes: %s', (size, expected) => {
    render(<Button size={size as any}>Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(btn.className).toContain(expected);
  });
});

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Heading } from './Heading';

describe('Heading', () => {
  it('renders with provided tag and default size classes', () => {
    render(<Heading as="h2">Title</Heading>);
    const el = screen.getByRole('heading', { level: 2 });
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('text-3xl');
    expect(el).toHaveClass('leading-snug');
  });

  it.each([
    ['h1', 1, 'text-4xl', 'leading-tight'],
    ['h2', 2, 'text-3xl', 'leading-snug'],
    ['h3', 3, 'text-2xl', 'leading-snug'],
    ['h4', 4, 'text-xl', 'leading-snug'],
    ['h5', 5, 'text-lg', 'leading-snug'],
    ['h6', 6, 'text-base', 'leading-snug'],
  ] as const)('uses correct default size for <%s>', (tag, level, sizeCls, leading) => {
    render(React.createElement(Heading, { as: tag as any }, 'Title'));
    const el = screen.getByRole('heading', { level });
    expect(el.tagName).toBe(tag.toUpperCase());
    expect(el).toHaveClass(sizeCls);
    expect(el).toHaveClass(leading);
  });

  it('supports visual size independent of tag', () => {
    render(
      <Heading as="h4" size="h1">
        Title
      </Heading>,
    );
    const el = screen.getByRole('heading', { level: 4 });
    expect(el).toHaveClass('text-4xl');
    expect(el).toHaveClass('leading-tight');
  });

  it('supports display size', () => {
    render(
      <Heading as="h2" size="display">
        Hero
      </Heading>,
    );
    const el = screen.getByRole('heading', { level: 2 });
    expect(el).toHaveClass('text-5xl');
    expect(el).toHaveClass('md:text-6xl');
    expect(el).toHaveClass('leading-tight');
  });

  it('applies tone classes', () => {
    const { rerender } = render(<Heading as="h2">Title</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-neutral-950');

    rerender(
      <Heading as="h2" tone="muted">
        Title
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-neutral-600');

    rerender(
      <Heading as="h2" tone="onPrimary">
        Title
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-neutral-0');
  });

  it('applies alignment classes', () => {
    const { rerender } = render(<Heading as="h2">Aligned</Heading>);
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-left');

    rerender(
      <Heading as="h2" align="center">
        Aligned
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-center');

    rerender(
      <Heading as="h2" align="right">
        Aligned
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-right');
  });

  it('merges custom className', () => {
    render(
      <Heading as="h2" className="custom-x">
        Title
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toHaveClass('custom-x');
  });

  it('forwards ref to the heading element', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(
      <Heading as="h2" ref={ref}>
        Ref
      </Heading>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('H2');
  });

  it('forwards ref with custom tag', () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(
      <Heading as="h4" ref={ref}>
        Ref
      </Heading>,
    );
    expect(ref.current?.tagName).toBe('H4');
  });

  it('passes through extra props', () => {
    render(
      <Heading as="h2" data-test-id="heading" id="my-heading">
        Extra
      </Heading>,
    );
    const el = screen.getByRole('heading', { level: 2 });
    expect(el).toHaveAttribute('data-test-id', 'heading');
    expect(el).toHaveAttribute('id', 'my-heading');
  });
});

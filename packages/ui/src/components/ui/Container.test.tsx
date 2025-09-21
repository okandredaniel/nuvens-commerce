import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
  it('renders as a div by default with base classes', () => {
    render(<Container data-testid="c">Child</Container>);
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('DIV');
    expect(el).toHaveClass('container');
    expect(el).toHaveClass('mx-auto');
    expect(el.className).toContain('px-4');
    expect(el.className).toContain('sm:px-6');
    expect(el.className).toContain('lg:px-8');
    expect(el).toHaveTextContent('Child');
  });

  it('renders as a custom element via "as" prop', () => {
    render(
      <Container as="section" data-testid="c">
        Child
      </Container>,
    );
    const el = screen.getByTestId('c');
    expect(el.tagName).toBe('SECTION');
  });

  it('forwards ref to the rendered element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Container ref={ref} data-testid="c" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it('merges custom className', () => {
    render(
      <Container className="extra-class" data-testid="c">
        Child
      </Container>,
    );
    const el = screen.getByTestId('c');
    expect(el.className).toContain('extra-class');
  });

  it('spreads arbitrary props', () => {
    render(
      <Container id="custom-id" role="region" aria-label="Container region" tabIndex={0}>
        Child
      </Container>,
    );
    const el = screen.getByRole('region', { name: 'Container region' });
    expect(el).toHaveAttribute('id', 'custom-id');
    expect(el).toHaveAttribute('tabindex', '0');
  });

  it('fires event handlers passed in props', () => {
    const onClick = vi.fn();
    render(
      <Container data-testid="c" onClick={onClick}>
        Click
      </Container>,
    );
    fireEvent.click(screen.getByTestId('c'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

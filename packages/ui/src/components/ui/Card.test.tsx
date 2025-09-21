import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

describe('Card primitives', () => {
  it('renders Card with base classes and children', () => {
    render(<Card data-testid="card">Content</Card>);
    const el = screen.getByTestId('card');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('ui-radius-lg');
    expect(el).toHaveClass('border');
    expect(el).toHaveClass('bg-neutral-0');
    expect(el).toHaveTextContent('Content');
  });

  it('merges Card className and forwards events and props', () => {
    const onClick = vi.fn();
    render(
      <Card id="root" tabIndex={0} className="extra" onClick={onClick}>
        Click
      </Card>,
    );
    const el = screen.getByText('Click');
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('id', 'root');
    expect(el).toHaveAttribute('tabindex', '0');
    fireEvent.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders CardHeader with padding classes and merges className', () => {
    render(
      <CardHeader data-testid="hdr" className="hdr-extra">
        Header
      </CardHeader>,
    );
    const el = screen.getByTestId('hdr');
    expect(el).toHaveClass('p-5');
    expect(el.className).toContain('md:p-6');
    expect(el).toHaveClass('hdr-extra');
    expect(el).toHaveTextContent('Header');
  });

  it('renders CardTitle as heading h3 with classes and merges className', () => {
    render(<CardTitle className="ttl-extra">Title</CardTitle>);
    const h = screen.getByRole('heading', { name: 'Title', level: 3 });
    expect(h.tagName).toBe('H3');
    expect(h).toHaveClass('text-base');
    expect(h.className).toContain('md:text-lg');
    expect(h).toHaveClass('font-semibold');
    expect(h).toHaveClass('ttl-extra');
  });

  it('renders CardDescription as paragraph with classes and merges className', () => {
    render(<CardDescription className="desc-extra">Description</CardDescription>);
    const p = screen.getByText('Description');
    expect(p.tagName).toBe('P');
    expect(p).toHaveClass('text-sm');
    expect(p).toHaveClass('text-neutral-600');
    expect(p).toHaveClass('desc-extra');
  });

  it('renders CardContent with padding classes and merges className', () => {
    render(
      <CardContent data-testid="cnt" className="cnt-extra">
        Body
      </CardContent>,
    );
    const el = screen.getByTestId('cnt');
    expect(el).toHaveClass('p-5');
    expect(el.className).toContain('md:p-6');
    expect(el).toHaveClass('cnt-extra');
    expect(el).toHaveTextContent('Body');
  });
});

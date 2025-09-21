import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('does not render dialog when open is false', () => {
    render(
      <Sheet open={false} onOpenChange={vi.fn()}>
        <div>Content</div>
      </Sheet>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders dialog with title and children when open', () => {
    render(
      <Sheet open={true} onOpenChange={vi.fn()} title="Panel title">
        <div>Body content</div>
      </Sheet>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Panel title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('calls onOpenChange(false) when clicking close button', () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange} title="Title">
        <div>Body</div>
      </Sheet>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onOpenChange(false) on Escape key', () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange} title="Title">
        <div>Body</div>
      </Sheet>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('applies right side classes by default', () => {
    render(
      <Sheet open={true} onOpenChange={vi.fn()} title="Title">
        <div>Body</div>
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog') as HTMLDivElement;
    expect(dialog.className).toContain('right-0');
  });

  it('applies left side classes when side="left"', () => {
    render(
      <Sheet open={true} onOpenChange={vi.fn()} side="left" title="Title">
        <div>Body</div>
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog') as HTMLDivElement;
    expect(dialog.className).toContain('left-0');
  });

  it('applies custom widthClass', () => {
    render(
      <Sheet open={true} onOpenChange={vi.fn()} widthClass="w-[480px]" title="Title">
        <div>Body</div>
      </Sheet>,
    );
    const dialog = screen.getByRole('dialog') as HTMLDivElement;
    expect(dialog.className).toContain('w-[480px]');
  });

  it('uses custom closeAriaLabel', () => {
    render(
      <Sheet open={true} onOpenChange={vi.fn()} title="Title" closeAriaLabel="Dismiss">
        <div>Body</div>
      </Sheet>,
    );
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('omits header and close button when title is not provided', () => {
    render(
      <Sheet open={true} onOpenChange={vi.fn()}>
        <div>Body</div>
      </Sheet>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('forwards ref to dialog content element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Sheet open={true} onOpenChange={vi.fn()} title="Title" ref={ref}>
        <div>Body</div>
      </Sheet>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.getAttribute('role')).toBe('dialog');
  });
});

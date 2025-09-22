import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('allows typing and respects placeholder', () => {
    render(<Input placeholder="Your name" />);
    const input = screen.getByPlaceholderText('Your name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(input.value).toBe('Alice');
  });

  it('merges custom class names', () => {
    render(<Input className="custom-class" aria-label="merge" />);
    const input = screen.getByLabelText('merge');
    expect(input.className).toContain('custom-class');
  });

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="ref" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('respects disabled attribute', () => {
    render(<Input disabled aria-label="disabled" />);
    const input = screen.getByLabelText('disabled');
    expect(input).toBeDisabled();
  });

  it('defaults to md size when not provided', () => {
    render(<Input aria-label="default" />);
    const input = screen.getByLabelText('default');
    expect(input.className).toContain('ui-form-elements-height');
    expect(input.className).toContain('px-3');
  });

  it.each([
    ['sm', 'ui-form-elements-height-sm'],
    ['md', 'ui-form-elements-height'],
    ['lg', 'ui-form-elements-height-lg'],
  ] as const)('applies size classes: %s', (size, expected) => {
    render(<Input size={size} aria-label="sized" />);
    const input = screen.getByLabelText('sized');
    expect(input.className).toContain(expected);
  });

  it('applies lg-specific padding', () => {
    render(<Input size="lg" aria-label="big" />);
    const input = screen.getByLabelText('big');
    expect(input.className).toContain('px-4');
  });
});

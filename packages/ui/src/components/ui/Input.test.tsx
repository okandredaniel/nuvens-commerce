import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('allows typing and respects placeholder', () => {
    render(<Input placeholder="Your name" />);
    const input = screen.getByPlaceholderText('Your name') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(input.value).toBe('Alice');
  });

  it('applies size class when size="lg"', () => {
    render(<Input size="lg" aria-label="big" />);
    const input = screen.getByLabelText('big');
    expect(input.className).toMatch(/h-11/);
  });
});

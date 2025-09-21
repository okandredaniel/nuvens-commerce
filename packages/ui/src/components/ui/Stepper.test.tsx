import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('increments and decrements respecting bounds', () => {
    const onChange = vi.fn();
    render(<Stepper value={1} min={1} max={2} onChange={onChange} />);
    const inc = screen.getByRole('button', { name: /increase/i });
    const dec = screen.getByRole('button', { name: /decrease/i });
    fireEvent.click(inc);
    expect(onChange).toHaveBeenCalledWith(2);
    fireEvent.click(inc);
    expect(onChange).toHaveBeenLastCalledWith(2);
    fireEvent.click(dec);
    expect(onChange).toHaveBeenLastCalledWith(1);
  });
});

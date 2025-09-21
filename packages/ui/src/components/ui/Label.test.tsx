import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Label } from './Label';

describe('Label', () => {
  it('renders a label element with base classes', () => {
    render(<Label>Username</Label>);
    const el = screen.getByText('Username');
    expect(el.tagName).toBe('LABEL');
    expect(el).toHaveClass('text-sm');
    expect(el).toHaveClass('font-medium');
    expect(el).toHaveClass('text-neutral-900');
  });

  it('merges className and forwards htmlFor', () => {
    render(
      <div>
        <Label htmlFor="email" className="extra">
          Email
        </Label>
        <input id="email" />
      </div>,
    );
    const el = screen.getByText('Email');
    expect(el).toHaveClass('extra');
    expect(el).toHaveAttribute('for', 'email');
  });

  it('associates with control so getByLabelText finds the input', () => {
    render(
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <input id="fullName" />
      </div>,
    );
    const input = screen.getByLabelText('Full name');
    expect(input.tagName).toBe('INPUT');
  });

  it('forwards ref to the label element', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it('clicking the label triggers click on associated input', () => {
    const onClick = vi.fn();
    render(
      <div>
        <Label htmlFor="agree">I agree</Label>
        <input id="agree" onClick={onClick} />
      </div>,
    );
    fireEvent.click(screen.getByText('I agree'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

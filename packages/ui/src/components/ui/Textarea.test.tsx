import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React, { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with base classes and no "undefined" in className', () => {
    render(<Textarea aria-label="Message" />);
    const el = screen.getByRole('textbox', { name: 'Message' });
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('w-full');
    expect(el).toHaveClass('rounded-lg');
    expect(el.className).not.toMatch(/undefined/);
  });

  it('merges custom className', () => {
    render(<Textarea aria-label="Message" className="custom-class" />);
    const el = screen.getByRole('textbox', { name: 'Message' });
    expect(el.className).toContain('custom-class');
  });

  it('forwards ref to the textarea element', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea aria-label="Ref" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('supports uncontrolled changes', () => {
    render(<Textarea aria-label="Message" defaultValue="hi" />);
    const el = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement;
    fireEvent.change(el, { target: { value: 'hello' } });
    expect(el).toHaveValue('hello');
  });

  it('supports controlled changes', () => {
    function Controlled() {
      const [v, setV] = useState('a');
      return <Textarea aria-label="Controlled" value={v} onChange={(e) => setV(e.target.value)} />;
    }
    render(<Controlled />);
    const el = screen.getByRole('textbox', { name: 'Controlled' }) as HTMLTextAreaElement;
    fireEvent.change(el, { target: { value: 'b' } });
    expect(el).toHaveValue('b');
  });

  it('respects disabled prop', () => {
    render(<Textarea aria-label="Disabled" disabled />);
    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
  });

  it('applies rows and placeholder props', () => {
    render(<Textarea aria-label="Rows" rows={5} placeholder="Type here" />);
    const el = screen.getByPlaceholderText('Type here');
    expect(el).toHaveAttribute('rows', '5');
  });

  it('accepts focus and becomes the active element', () => {
    render(<Textarea aria-label="Focus" />);
    const el = screen.getByRole('textbox', { name: 'Focus' }) as HTMLTextAreaElement;
    el.focus();
    expect(el).toHaveFocus();
  });
});

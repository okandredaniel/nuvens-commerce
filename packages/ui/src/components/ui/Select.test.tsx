import * as SelectPrimitive from '@radix-ui/react-select';
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select';

beforeAll(() => {
  Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
    value: vi.fn(),
    configurable: true,
  });
});

describe('Select', () => {
  it('shows placeholder when no value is selected', () => {
    render(
      <Select>
        <SelectTrigger placeholder="Choose one" aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'trigger' })).toHaveTextContent('Choose one');
  });

  it('renders defaultValue in trigger', () => {
    render(
      <Select defaultValue="b">
        <SelectTrigger aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'trigger' })).toHaveTextContent('Beta');
  });

  it('changes the selected value on item click', async () => {
    render(
      <Select defaultValue="a">
        <SelectTrigger aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>,
    );
    fireEvent.click(screen.getByRole('combobox', { name: 'trigger' }));
    const option = await screen.findByRole('option', { name: 'Beta' });
    fireEvent.click(option);
    expect(screen.getByRole('combobox', { name: 'trigger' })).toHaveTextContent('Beta');
  });

  it('applies invalid state styles and aria-invalid', () => {
    render(
      <Select>
        <SelectTrigger invalid aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole('combobox', { name: 'trigger' });
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger.className).toContain('border-danger-600');
  });

  it('disables trigger when disabled', () => {
    render(
      <Select disabled>
        <SelectTrigger aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'trigger' })).toBeDisabled();
  });

  it('applies size classes on trigger', () => {
    const { rerender } = render(
      <Select>
        <SelectTrigger size="sm" aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'trigger' }).className).toContain(
      'ui-form-elements-height-sm',
    );
    expect(screen.getByRole('combobox', { name: 'trigger' }).className).toContain('px-3');

    rerender(
      <Select>
        <SelectTrigger size="md" aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'trigger' }).className).toContain(
      'ui-form-elements-height',
    );
    expect(screen.getByRole('combobox', { name: 'trigger' }).className).toContain('px-3');

    rerender(
      <Select>
        <SelectTrigger size="lg" aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'trigger' }).className).toContain(
      'ui-form-elements-height-lg',
    );
    expect(screen.getByRole('combobox', { name: 'trigger' }).className).toContain('px-4');
  });

  it('renders label and separator inside content', async () => {
    render(
      <Select>
        <SelectTrigger aria-label="trigger" />
        <SelectContent>
          <SelectPrimitive.Group>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="a">Apple</SelectItem>
          </SelectPrimitive.Group>
          <SelectSeparator />
          <SelectItem value="b">Banana</SelectItem>
        </SelectContent>
      </Select>,
    );
    fireEvent.click(screen.getByRole('combobox', { name: 'trigger' }));
    expect(await screen.findByText('Fruits')).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: 'Banana' })).toBeInTheDocument();
  });

  it('renders item hint when provided', async () => {
    render(
      <Select>
        <SelectTrigger aria-label="trigger" />
        <SelectContent>
          <SelectItem value="a" hint="Extra info">
            Alpha
          </SelectItem>
        </SelectContent>
      </Select>,
    );
    fireEvent.click(screen.getByRole('combobox', { name: 'trigger' }));
    expect(await screen.findByText('Extra info')).toBeInTheDocument();
  });

  it('SelectValue renders inside trigger', () => {
    render(
      <Select defaultValue="a">
        <SelectTrigger aria-label="trigger">
          <span className="custom-inner">
            <SelectValue />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'trigger' })).toHaveTextContent('Alpha');
  });
});

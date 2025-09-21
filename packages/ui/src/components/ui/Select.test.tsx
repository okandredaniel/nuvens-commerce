// packages/ui/src/components/ui/Select.test.tsx
import * as RadixSelect from '@radix-ui/react-select';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useState } from 'react';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from './Select';

beforeAll(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: () => {},
  });
  if (!(window as any).PointerEvent) {
    (window as any).PointerEvent = window.MouseEvent as any;
  }
  if (!(Element.prototype as any).hasPointerCapture) {
    Object.defineProperty(Element.prototype, 'hasPointerCapture', {
      configurable: true,
      value: () => false,
    });
  }
  if (!(Element.prototype as any).setPointerCapture) {
    Object.defineProperty(Element.prototype, 'setPointerCapture', {
      configurable: true,
      value: () => {},
    });
  }
  if (!(Element.prototype as any).releasePointerCapture) {
    Object.defineProperty(Element.prototype, 'releasePointerCapture', {
      configurable: true,
      value: () => {},
    });
  }
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get() {
      return 64;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() {
      return 1000;
    },
  });
});

async function openMenu() {
  const trigger = screen.getByRole('combobox');
  fireEvent.pointerDown(trigger);
  fireEvent.mouseDown(trigger);
  fireEvent.keyDown(trigger, { key: 'ArrowDown' });
  return await screen.findByRole('listbox');
}

describe('Select', () => {
  it('renders trigger with placeholder and updates when selecting an item', async () => {
    render(
      <Select>
        <SelectTrigger placeholder="Select an option" />
        <SelectContent>
          <SelectItem value="alpha">Alpha</SelectItem>
          <SelectItem value="beta">Beta</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Select an option');

    await openMenu();
    fireEvent.click(screen.getByRole('option', { name: 'Beta' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(screen.getByRole('combobox')).toHaveTextContent('Beta');
  });

  it('shows defaultValue and marks selected option as checked', async () => {
    render(
      <Select defaultValue="beta">
        <SelectTrigger placeholder="Select" />
        <SelectContent>
          <RadixSelect.Group>
            <SelectLabel>Options</SelectLabel>
            <SelectItem value="alpha">Alpha</SelectItem>
            <SelectSeparator />
            <SelectItem value="beta">Beta</SelectItem>
          </RadixSelect.Group>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Beta');

    const listbox = await openMenu();
    const beta = within(listbox).getByRole('option', { name: 'Beta' });
    expect(beta).toHaveAttribute('aria-selected', 'true');
    expect(within(listbox).getByText('Options')).toBeInTheDocument();
  });

  it('supports controlled value and onValueChange', async () => {
    function Controlled() {
      const [value, setValue] = useState('alpha');
      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger placeholder="Select" />
          <SelectContent>
            <SelectItem value="alpha">Alpha</SelectItem>
            <SelectItem value="beta">Beta</SelectItem>
          </SelectContent>
        </Select>
      );
    }
    render(<Controlled />);

    expect(screen.getByRole('combobox')).toHaveTextContent('Alpha');

    await openMenu();
    fireEvent.click(screen.getByRole('option', { name: 'Beta' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(screen.getByRole('combobox')).toHaveTextContent('Beta');
  });

  it('applies size classes on trigger', async () => {
    const { rerender } = render(
      <Select>
        <SelectTrigger placeholder="Select" size="sm" />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('h-9');

    rerender(
      <Select>
        <SelectTrigger placeholder="Select" size="md" />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('h-10');

    rerender(
      <Select>
        <SelectTrigger placeholder="Select" size="lg" />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('h-11');
  });

  it('sets aria-invalid and danger ring when invalid', async () => {
    render(
      <Select>
        <SelectTrigger placeholder="Select" invalid />
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger.className).toContain('border-danger-600');
    expect(trigger.className).toContain('focus-visible:ring-danger-600');
  });

  it('renders scroll controls when content is scrollable', async () => {
    render(
      <Select>
        <SelectTrigger placeholder="Select" />
        <SelectContent className="max-h-8" scrollUpLabel="Scroll up" scrollDownLabel="Scroll down">
          {Array.from({ length: 20 }).map((_, i) => (
            <SelectItem key={i} value={`v${i}`}>{`Item ${i}`}</SelectItem>
          ))}
        </SelectContent>
      </Select>,
    );
    const listbox = await openMenu();
    expect(listbox.querySelector('svg.lucide-chevron-down')).toBeTruthy();
  });

  it('toggles aria-expanded when opening', async () => {
    render(
      <Select>
        <SelectTrigger placeholder="Select" />
        <SelectContent>
          <SelectItem value="alpha">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    const listbox = await openMenu();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(listbox, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('supports custom className on trigger', () => {
    render(
      <Select>
        <SelectTrigger placeholder="Select" className="custom-trigger" />
        <SelectContent>
          <SelectItem value="alpha">Alpha</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('custom-trigger');
  });

  it('closes on selecting the same item and keeps it checked', async () => {
    render(
      <Select defaultValue="alpha">
        <SelectTrigger placeholder="Select" />
        <SelectContent>
          <SelectItem value="alpha">Alpha</SelectItem>
          <SelectItem value="beta">Beta</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('Alpha');

    let listbox = await openMenu();
    fireEvent.click(within(listbox).getByRole('option', { name: 'Alpha' }));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(screen.getByRole('combobox')).toHaveTextContent('Alpha');

    listbox = await openMenu();
    const alpha = within(listbox).getByRole('option', { name: 'Alpha' });
    expect(alpha).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates and selects via keyboard', async () => {
    render(
      <Select>
        <SelectTrigger placeholder="Select" />
        <SelectContent>
          <SelectItem value="alpha">Alpha</SelectItem>
          <SelectItem value="beta">Beta</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    fireEvent.keyDown(trigger, { key: 'Enter' });
    const listbox = await screen.findByRole('listbox');
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    const beta = within(listbox).getByRole('option', { name: 'Beta' });
    fireEvent.keyDown(beta, { key: 'Enter' });
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    expect(screen.getByRole('combobox')).toHaveTextContent('Beta');
  });
});

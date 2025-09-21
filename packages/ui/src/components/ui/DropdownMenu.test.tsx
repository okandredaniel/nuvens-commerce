import '@testing-library/jest-dom/vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  CheckboxItem,
  Content,
  DropdownMenu,
  Item,
  Label,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Trigger,
} from './DropdownMenu';

function MenuHarness({
  onSelectItem,
  itemDisabled = false,
  className,
}: {
  onSelectItem?: () => void;
  itemDisabled?: boolean;
  className?: string;
}) {
  const [checked, setChecked] = React.useState(false);
  const [value, setValue] = React.useState('a');
  return (
    <Root>
      <Trigger className="trigger-class">Open</Trigger>
      <Content className={className}>
        <Label>Actions</Label>
        <Item onSelect={onSelectItem} disabled={itemDisabled}>
          First
        </Item>
        <CheckboxItem checked={checked} onCheckedChange={setChecked}>
          Enable
        </CheckboxItem>
        <RadioGroup value={value} onValueChange={setValue}>
          <RadioItem value="a">Option A</RadioItem>
          <RadioItem value="b">Option B</RadioItem>
        </RadioGroup>
        <Separator />
      </Content>
    </Root>
  );
}

describe('DropdownMenu', () => {
  it('opens and renders content, label, items and separator', async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveClass('ui-radius-lg');
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(within(menu).getByRole('menuitem', { name: 'First' })).toBeInTheDocument();
    const checkbox = within(menu).getByRole('menuitemcheckbox', { name: 'Enable' });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    const radios = within(menu).getAllByRole('menuitemradio');
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
    expect(radios[1]).toHaveAttribute('aria-checked', 'false');
    expect(within(menu).getByRole('separator')).toBeInTheDocument();
  });

  it('merges custom className on Content and Trigger', async () => {
    const user = userEvent.setup();
    render(<MenuHarness className="content-extra" />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger.className).toContain('trigger-class');
    await user.click(trigger);
    const menu = await screen.findByRole('menu');
    expect(menu.className).toContain('content-extra');
  });

  it('invokes onSelect for enabled item and closes the menu', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MenuHarness onSelectItem={onSelect} />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('menuitem', { name: 'First' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('does not invoke onSelect for disabled item and keeps menu open', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<MenuHarness onSelectItem={onSelect} itemDisabled />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(await screen.findByRole('menuitem', { name: 'First' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('toggles checkbox item checked state', async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const checkbox = await screen.findByRole('menuitemcheckbox', { name: 'Enable' });
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('changes selected radio item within the group', async () => {
    const user = userEvent.setup();
    render(<MenuHarness />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const optionB = await screen.findByRole('menuitemradio', { name: 'Option B' });
    await user.click(optionB);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const optionA = await screen.findByRole('menuitemradio', { name: 'Option A' });
    expect(optionA).toHaveAttribute('aria-checked', 'false');
    expect(await screen.findByRole('menuitemradio', { name: 'Option B' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('forwards refs on Trigger and Content', async () => {
    const user = userEvent.setup();
    const triggerRef = React.createRef<HTMLButtonElement>();
    const contentRef = React.createRef<HTMLDivElement>();
    function RefHarness() {
      return (
        <Root>
          <Trigger ref={triggerRef}>Open</Trigger>
          <Content ref={contentRef}>
            <Item>First</Item>
          </Content>
        </Root>
      );
    }
    render(<RefHarness />);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const menu = await screen.findByRole('menu');
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current?.getAttribute('role')).toBe('menu');
    expect(menu).toBeInTheDocument();
  });

  it('also works via bundled namespace export', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>One</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByRole('menuitem', { name: 'One' })).toBeInTheDocument();
  });
});

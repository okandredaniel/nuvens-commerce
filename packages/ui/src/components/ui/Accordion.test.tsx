import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';

function countOpenTriggers() {
  return screen
    .getAllByRole('button', { name: 'Toggle' })
    .filter((el) => el.getAttribute('aria-expanded') === 'true').length;
}

describe('Accordion', () => {
  it('renders single mode with default open', () => {
    const items = [
      { id: 'a', title: 'A', content: 'Content A' },
      { id: 'b', title: 'B', content: 'Content B' },
    ];

    render(<Accordion type="single" items={items} ariaToggleLabel="Toggle" defaultValue="a" />);

    expect(countOpenTriggers()).toBe(1);
    expect(screen.getByText('Content A').closest('[data-state]')).toHaveAttribute(
      'data-state',
      'open',
    );
    const bOpen = screen.queryByText('Content B')?.closest('[data-state="open"]');
    expect(bOpen).toBeNull();
  });

  it('toggles single mode when collapsible=true (default)', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 'a', title: 'A', content: 'Content A' },
      { id: 'b', title: 'B', content: 'Content B' },
    ];

    render(<Accordion type="single" items={items} ariaToggleLabel="Toggle" defaultValue="a" />);

    const triggers = screen.getAllByRole('button', { name: 'Toggle' });
    await user.click(triggers[0]);
    expect(countOpenTriggers()).toBe(0);

    await user.click(triggers[1]);
    expect(countOpenTriggers()).toBe(1);
    expect(screen.getByText('Content B').closest('[data-state]')).toHaveAttribute(
      'data-state',
      'open',
    );
    expect(screen.getByText('Content A').closest('[data-state]')).toHaveAttribute(
      'data-state',
      'closed',
    );
  });

  it('does not allow closing last open item when collapsible=false', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 'a', title: 'A', content: 'Content A' },
      { id: 'b', title: 'B', content: 'Content B' },
    ];

    render(
      <Accordion
        type="single"
        items={items}
        ariaToggleLabel="Toggle"
        defaultValue="a"
        collapsible={false}
      />,
    );

    const triggerA = screen.getAllByRole('button', { name: 'Toggle' })[0];
    await user.click(triggerA);
    expect(countOpenTriggers()).toBe(1);
    expect(screen.getByText('Content A').closest('[data-state]')).toHaveAttribute(
      'data-state',
      'open',
    );
  });

  it('multiple mode supports multiple open panels and toggling', async () => {
    const user = userEvent.setup();
    const items = [
      { title: 'Item 0', content: 'C0' },
      { title: 'Item 1', content: 'C1' },
      { title: 'Item 2', content: 'C2' },
    ];

    render(
      <Accordion type="multiple" items={items} ariaToggleLabel="Toggle" defaultValue={['1']} />,
    );

    expect(screen.getByText('C1').closest('[data-state]')).toHaveAttribute('data-state', 'open');

    const [t0, t1] = screen.getAllByRole('button', { name: 'Toggle' });
    await user.click(t0);
    expect(screen.getByText('C0').closest('[data-state]')).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('C1').closest('[data-state]')).toHaveAttribute('data-state', 'open');
    expect(countOpenTriggers()).toBe(2);

    await user.click(t1);
    expect(screen.getByText('C1').closest('[data-state]')).toHaveAttribute('data-state', 'closed');
    expect(countOpenTriggers()).toBe(1);
  });

  it('updates when defaultValue changes (single and multiple)', async () => {
    const items = [
      { id: 'a', title: 'A', content: 'Content A' },
      { id: 'b', title: 'B', content: 'Content B' },
      { id: 'c', title: 'C', content: 'Content C' },
    ];

    const { rerender } = render(
      <Accordion type="single" items={items} ariaToggleLabel="Toggle" defaultValue="a" />,
    );
    expect(screen.getByText('Content A').closest('[data-state]')).toHaveAttribute(
      'data-state',
      'open',
    );

    rerender(<Accordion type="single" items={items} ariaToggleLabel="Toggle" defaultValue="b" />);
    expect(screen.getByText('Content B').closest('[data-state]')).toHaveAttribute(
      'data-state',
      'open',
    );
    expect(screen.getByText('Content A').closest('[data-state]')).toHaveAttribute(
      'data-state',
      'closed',
    );

    const items2 = [
      { title: 'I0', content: 'M0' },
      { title: 'I1', content: 'M1' },
      { title: 'I2', content: 'M2' },
    ];
    rerender(
      <Accordion type="multiple" items={items2} ariaToggleLabel="Toggle" defaultValue={['0']} />,
    );
    expect(screen.getByText('M0').closest('[data-state]')).toHaveAttribute('data-state', 'open');

    rerender(
      <Accordion
        type="multiple"
        items={items2}
        ariaToggleLabel="Toggle"
        defaultValue={['0', '2']}
      />,
    );
    expect(screen.getByText('M2').closest('[data-state]')).toHaveAttribute('data-state', 'open');
  });

  it('renders various content types', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 's', title: 'String', content: 'String Content' },
      {
        id: 'h',
        title: 'HTML',
        content: { __html: '<strong data-testid="html-c">HTML Content</strong>' },
      },
      { id: 'n', title: 'Node', content: <div data-testid="node-c">Node Content</div> },
    ];

    render(<Accordion type="single" items={items} ariaToggleLabel="Toggle" />);

    const [tS, tH, tN] = screen.getAllByRole('button', { name: 'Toggle' });

    await user.click(tS);
    expect(screen.getByText('String Content')).toBeInTheDocument();

    await user.click(tH);
    expect(screen.getByTestId('html-c')).toHaveTextContent('HTML Content');

    await user.click(tN);
    expect(screen.getByTestId('node-c')).toHaveTextContent('Node Content');
  });

  it('applies custom class names on root, item and content', async () => {
    const user = userEvent.setup();
    const items = [
      { id: 'x', title: 'X', content: 'CX' },
      { id: 'y', title: 'Y', content: 'CY' },
    ];

    const { container } = render(
      <Accordion
        type="single"
        items={items}
        ariaToggleLabel="Toggle"
        className="root-x"
        itemClassName="item-x"
        contentClassName="content-x"
      />,
    );

    const root = container.querySelector('.root-x');
    expect(root).toBeInTheDocument();

    const [trigger] = screen.getAllByRole('button', { name: 'Toggle' });
    await user.click(trigger);
    expect(container.querySelector('.item-x')).toBeTruthy();
    expect(container.querySelector('.content-x')).toBeTruthy();
  });

  it('falls back to index-based ids when item.id is missing', async () => {
    const user = userEvent.setup();
    const items = [
      { title: 'T0', content: 'C0' },
      { title: 'T1', content: 'C1' },
    ];
    render(
      <Accordion type="multiple" items={items} ariaToggleLabel="Toggle" defaultValue={['1']} />,
    );
    expect(screen.getByText('C1').closest('[data-state]')).toHaveAttribute('data-state', 'open');

    const [t0] = screen.getAllByRole('button', { name: 'Toggle' });
    await user.click(t0);
    expect(countOpenTriggers()).toBe(2);
  });
});

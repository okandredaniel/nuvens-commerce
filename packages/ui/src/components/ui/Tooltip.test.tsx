import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

beforeAll(() => {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  if (!window.ResizeObserver) window.ResizeObserver = RO as any;
});

function getContentFromRole() {
  const roleEl = screen.getByRole('tooltip');
  return roleEl.parentElement as HTMLElement | null;
}

describe('Tooltip', () => {
  it('does not render when closed', () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open={false}>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
          <Tooltip.Content>Help</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows content when controlled open', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
          <Tooltip.Content>Help text</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    const roleEl = await screen.findByRole('tooltip');
    expect(roleEl).toBeInTheDocument();
    const content = getContentFromRole()!;
    expect(content).toHaveTextContent('Help text');
  });

  it('applies default variant classes and merges className', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
          <Tooltip.Content className="custom-x">Tip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await screen.findByRole('tooltip');
    const content = getContentFromRole()!;
    expect(content.className).toContain('border-neutral-200');
    expect(content.className).toContain('bg-neutral-0');
    expect(content.className).toContain('text-neutral-900');
    expect(content.className).toContain('custom-x');
  });

  it('renders arrow with default fill class', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
          <Tooltip.Content>Tip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await screen.findByRole('tooltip');
    const content = getContentFromRole()!;
    const arrow = content.querySelector('svg');
    const cls = arrow?.getAttribute('class') || '';
    expect(cls).toContain('fill-neutral-0');
  });

  it('applies inverted variant classes and arrow fill', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
          <Tooltip.Content variant="inverted">Tip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await screen.findByRole('tooltip');
    const content = getContentFromRole()!;
    expect(content.className).toContain('border-neutral-800');
    expect(content.className).toContain('bg-neutral-900');
    expect(content.className).toContain('text-neutral-0');
    const arrow = content.querySelector('svg');
    const cls = arrow?.getAttribute('class') || '';
    expect(cls).toContain('fill-neutral-900');
  });

  it('sets side data attribute when side is specified', async () => {
    render(
      <Tooltip.Provider>
        <Tooltip.Root open>
          <Tooltip.Trigger>Hover</Tooltip.Trigger>
          <Tooltip.Content side="top">Tip</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await screen.findByRole('tooltip');
    const content = getContentFromRole()!;
    expect(content.getAttribute('data-side')).toBe('top');
  });
});
